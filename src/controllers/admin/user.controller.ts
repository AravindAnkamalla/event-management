import { NextFunction, Request, response, Response } from "express";
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
      .json(users);
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
    const { userId } = req.params;
    await AdminService.deleteUser(Number(userId));
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
    const { userId } = req.params;
    const user = await AdminService.getUserById(Number(userId));
    res.status(200).json(user);
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
    const { userId } = req.params;
    const result = await AdminService.inviteUser({ id: Number(userId) });
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
    const response = await AdminService.upsertUser(validatedInput);
    res
      .status(200)
      .json(response);
  } catch (error) {
    next(error);
  }
};
