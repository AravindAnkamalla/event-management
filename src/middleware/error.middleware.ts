import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal Server Error" });
};
