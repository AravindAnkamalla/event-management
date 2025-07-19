import { prismaClient } from "../../config/db";
import {
  cancelRegistrationInput,
  createRegistrationInput,
} from "../../validations/registrations.validation";

export const RegistrationsService = {
  registerEvent: async (input: createRegistrationInput) => {
    const { userId, eventId, status } = input;
    const registeredEvent = await prismaClient.registrations.findFirst({
      where: {
        eventId,
        userId,
        status,
      },
    });
    if (registeredEvent) {
      throw new Error("You already registered for Event");
    }
    const registration = await prismaClient.registrations.create({
      data: {
        ...input,
      },
    });
    return registration;
  },
  cancelRegistration: async (input: cancelRegistrationInput) => {
    const { userId, eventId } = input;
    const registration = await prismaClient.registrations.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    await prismaClient.registrations.update({
      where: {
        userId_eventId: { userId, eventId },
      },
      data: {
        status: "CANCELLED",
      },
    });
  },
};
