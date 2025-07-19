import { Router } from "express";
import { login, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/auth/auth.controller";

const authRoutes: Router = Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signUp);
authRoutes.post("/send-otp", sendOtp);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/reset-password", resetPassword);
export default authRoutes;