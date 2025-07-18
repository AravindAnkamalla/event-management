import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { config } from "../config/env";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, config.jwtSecret) as any;
    req.user = { id: decoded.userId, role: decoded.UserRole };
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorize = (role: "ADMIN" | "USER") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
