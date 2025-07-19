import { NextFunction, Request, Response } from "express";
import { createUserSchema } from "../../validations/admin.validation";
import { ProfileService } from "../../services/user/profile.service";

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.user.id);
    const validatedInput = await createUserSchema.parse(req.body);
    const response = await ProfileService.updateUser(id, validatedInput);
    res
      .status(200)
      .json({
        data: response,
        message: "profile details updated successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const getProfileDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.user.id);
    const response = await ProfileService.getProfileDetails(id);
    res
      .status(200)
      .json({
        data: response,
        message: "profile details fetched successfully",
      });
  } catch (error) {
    next(error);
  }
};
