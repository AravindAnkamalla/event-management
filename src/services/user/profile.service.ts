import { Role } from "@prisma/client";
import { prismaClient } from "../../config/db";
import { CreateUserInput } from "../../validations/admin.validation";

export const ProfileService = {
  updateUser: async (id: number, input: CreateUserInput) => {
    const { username, email, mobile, role } = input;

    const existingUser = await prismaClient.users.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = await prismaClient.users.update({
      where: { id },
      data: {
        username,
        email,
        mobile,
        role: role ?? existingUser.role,
        updatedBy: Role.ADMIN,
      },
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
    };
  },
  getProfileDetails: async (userId: number) => {
    const profileDetails = await prismaClient.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        mobile: true,
        isFirstLogin: true,
        role: true,
        username: true,
        registrations: true,
      },
    });
    if(!profileDetails){
        throw new Error('User details not found')
    }
    return profileDetails;
  },
};
