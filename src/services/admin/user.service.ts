import { hashSync } from "bcrypt";
import { prismaClient } from "../../config/db";
import {
  CreateUserInput,
  InviteUserInput,
  UpsertUserInput,
} from "../../validations/admin.validation";
import { sendAccountCreatedEmail } from "../../utils/mailer";
import { InvitationStatus, Role } from "@prisma/client";
import { generateNumericPassword } from "../../utils/helpers";

export const AdminService = {
  createUser: async (input: CreateUserInput) => {
    const { username, email, mobile, role } = input;

    const existingUser = await prismaClient.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const generatedPassword = generateNumericPassword(6);
    const hashedPassword = hashSync(generatedPassword, 10);

    const newUser = await prismaClient.users.create({
      data: {
        username,
        email,
        mobile,
        password: hashedPassword,
        role: role ?? Role.USER,
        createdBy: Role.ADMIN,
        updatedBy: Role.ADMIN,
      },
    });

    const sendInvitationEmail = await sendAccountCreatedEmail({
      username: newUser.username,
      email: newUser.email,
      password: generatedPassword,
    });
    if (sendInvitationEmail.status !== "success") {
      throw new Error("Failed to send account creation email");
    }
   await prismaClient.users.update({
      where: { id: newUser.id },
      data: { invitation: InvitationStatus.SENT },
    });

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  },
  getUsers: async () => {
    const users = await prismaClient.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        mobile: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {users, message: "Users fetched successfully"};
  },
  getUserById: async (id: number) => {
    const user = await prismaClient.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        mobile: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return {user, message: "User details fetched successfully"};
  },
  deleteUser: async (id: number) => {
    const user = await prismaClient.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    await prismaClient.users.delete({
      where: { id },
    });
    return {userId: user.id, message: "User deleted successfully" };
  },
  inviteUser: async (input: InviteUserInput) => {
    const { id } = input;

    const user = await prismaClient.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.invitation === InvitationStatus.SENT) {
      throw new Error("Invitation already sent to this user");
    }

    const generatedPassword = generateNumericPassword(6);
    const hashedPassword = hashSync(generatedPassword, 10);

    const sendInvitationEmail = await sendAccountCreatedEmail({
      username: user.username,
      email: user.email,
      password: generatedPassword,
    });

    if (sendInvitationEmail.status !== "success") {
      throw new Error("Failed to send invitation email");
    }
    await prismaClient.users.update({
      where: { id },
      data: {
        password: hashedPassword,
        invitation: InvitationStatus.SENT,
        updatedBy: Role.ADMIN,
      },
    });

    return { userId :user.id,message: "User invited successfully" };
  },
  upsertUser: async (input: UpsertUserInput) => {
    const { id, ...userData } = input;

    if (id) {
      const updatedUser = await prismaClient.users.update({
        where: { id },
        data: userData,
      });

      return {
        message: "User updated successfully",
        user: updatedUser,
      };
    } else {
      const { password, ...dataWithoutPassword } = userData;
      const hashedPassword = password
        ? hashSync(password, 10)
        : hashSync(generateNumericPassword(6), 10);
      const createdUser = await prismaClient.users.create({
        data: {
          password: hashedPassword,
          ...dataWithoutPassword,
        },
      });
      const sendInvitationEmail = await sendAccountCreatedEmail({
        username: createdUser.username,
        email: createdUser.email,
        password: password || generateNumericPassword(6),
      });
      if (sendInvitationEmail.status !== "success") {
        throw new Error("Failed to send account creation email");
      }
      await prismaClient.users.update({
        where: { id: createdUser.id },
        data: { invitation: InvitationStatus.SENT },
      });
      const { password: _, ...userWithoutPassword } = createdUser;

      return {
        message: "User created successfully",
        user: userWithoutPassword,
      };
    }
  },
};
