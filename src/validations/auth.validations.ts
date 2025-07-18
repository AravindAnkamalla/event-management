import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP must be exactly 6 characters long"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long")
    .max(64, "New password cannot exceed 64 characters"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;