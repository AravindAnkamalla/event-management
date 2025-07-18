import { Request, Response, NextFunction } from "express";
import {
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  signUpSchema,
  verifyOtpSchema,
} from "../validations/auth.validations";
import { AuthService } from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedInput);
    res.status(200).json({ data: result, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = signUpSchema.parse(req.body);
    const result = await AuthService.signUp(validatedInput);
    res
      .status(201)
      .json({ message: "User signed up successfully", data: result });
  } catch (error) {
    next(error);
  }
};
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = sendOtpSchema.parse(req.body);
    const result = await AuthService.sendOtp(validatedInput);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = verifyOtpSchema.parse(req.body);
    const result = await AuthService.verifyOtp(validatedInput);
    res
      .status(200)
      .json({ message: "OTP verified successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(validatedInput);
    res.status(200).json({ message: "Password reset successfully", data: result });
  } catch (error) {
    next(error);
  }
};  
