import { compareSync, hashSync } from "bcrypt";
import { prismaClient } from "../config/db";
import {
  LoginInput,
  ResetPasswordInput,
  SendOtpInput,
  SignUpInput,
  VerifyOtpInput,
} from "../validations/auth.validations";
import { generateAccessToken } from "../utils/jwt";
import { sendOtpEmail } from "../utils/mailer";
import { generateNumericPassword } from "../utils/helpers";

export const AuthService = {
  login: async (input: LoginInput) => {
    const user = await prismaClient.user.findUnique({
      where: { email: input.email },
    });
    if (!user || !compareSync(input.password, user.password)) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      UserRole: user.role,
    });
    const refreshToken = generateAccessToken({
      userId: user.id,
      UserRole: user.role,
    });
    const { password: _, ...userWithoutPass } = user;

    return { user: userWithoutPass, accessToken, refreshToken };
  },

  signUp: async (input: SignUpInput) => {
    const existingUser = await prismaClient.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashSync(input.password, 10);
    const newUser = await prismaClient.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    const accessToken = generateAccessToken({
      userId: newUser.id,
      UserRole: newUser.role,
    });
    const refreshToken = generateAccessToken({
      userId: newUser.id,
      UserRole: newUser.role,
    });

    return {
      message: "User signed up successfully",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },
  sendOtp: async (input: SendOtpInput) => {
    const { email } = input;

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const existingOtp = await prismaClient.oTP.findFirst({
      where: {
        email,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    let otpCode: string;

    if (existingOtp) {
      otpCode = existingOtp.code;
      console.log(`✅ Reusing existing OTP for ${email}: ${otpCode}`);
    } else {
      otpCode = generateNumericPassword();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

      await prismaClient.oTP.create({
        data: {
          email,
          code: otpCode,
          expiresAt,
        },
      });

      console.log(`📧 New OTP for ${email}: ${otpCode}`);
    }

    await sendOtpEmail({
      to: email,
      otp: otpCode,
      username: user.username,
      expirationMinutes: 10,
    });

    return {
      message: existingOtp
        ? "OTP already sent. Please check your email."
        : "New OTP sent successfully",
    };
  },
  verifyOtp: async (input: VerifyOtpInput) => {
    const { email, code } = input;

    const otp = await prismaClient.oTP.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      throw new Error("Invalid or expired OTP");
    }
    return { message: "OTP verified successfully" };
  },
  resetPassword: async (input: ResetPasswordInput) => {
    const { email, newPassword } = input;
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const hashedPassword = hashSync(newPassword, 10);
    await prismaClient.user.update({
      where: { email },
      data: { password: hashedPassword, isFirstLogin: false },
    });

    return { message: "Password reset successfully" };
  },
};
