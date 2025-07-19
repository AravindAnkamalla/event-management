import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { config } from "../config/env";
declare global {
  namespace Express {
    interface Request {
      user: {
        id?: number;
        role?: "ADMIN" | "USER";
      };
    }
  }
}
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  console.log(`Authenticating token: ${req.headers.authorization}`);
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const decoded = verifyToken(token, config.jwtSecret) as any;
    req.user = { id: decoded.userId, role: decoded.UserRole };
    console.log(`Token verified successfully for user ID: ${req.user.id}`);
    next();
  } catch(error) {
    console.error("Token verification failed", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorize = (role: "ADMIN" | "USER") => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Authorizing role: ${req.user}`);
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
