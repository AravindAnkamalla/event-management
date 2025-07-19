import { NextFunction, Request, Response } from "express";
import {
  cancelRegistrationSchema,
  createRegistrationSchema,
} from "../../validations/registrations.validation";
import { RegistrationsService } from "../../services/registrations/registrations.service";

export const registerEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = await createRegistrationSchema.parse(req.body);
    const response = await RegistrationsService.registerEvent(validatedInput);
    res
      .status(200)
      .json({ message: "success fully registered for the event " });
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = await cancelRegistrationSchema.parse(req.body);
    const response =
      await RegistrationsService.cancelRegistration(validatedInput);
    res
      .status(200)
      .json({ message: "successfully cancelled for the registration " });
  } catch (error) {
    next(error);
  }
};
