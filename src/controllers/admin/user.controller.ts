import { NextFunction, Request, Response } from "express";
import { AdminService } from "../../services/admin/user.service";
import {
  createUserSchema,
  UpsertUserSchema,
} from "../../validations/admin.validation";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = createUserSchema.parse(req.body);
    const result = await AdminService.createUser(validatedInput);
    res
      .status(201)
      .json({ message: "User created successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await AdminService.getUsers();
    res
      .status(200)
      .json({ data: users, message: "Users fetched successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await AdminService.deleteUser(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await AdminService.getUserById(Number(id));
    res.status(200).json({ data: user, message: "User fetched successfully" });
  } catch (error) {
    next(error);
  }
};
export const inviteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.inviteUser({ id: Number(id) });
    res
      .status(200)
      .json({ message: "User invited successfully", data: result });
  } catch (error) {
    next(error);
  }
};
export const upsertUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = UpsertUserSchema.parse(req.body);
    const result = await AdminService.upsertUser(validatedInput);
    res
      .status(200)
      .json({ message: "User upserted successfully", data: result });
  } catch (error) {
    next(error);
  }
};
