import z from "zod";

export const createRegistrationSchema = z.object({
  userId: z.number().int("User ID must be an integer"),
  eventId: z.number().int("Event ID must be an integer"),
  status: z.enum(["REGISTERED", "CANCELLED"])
});
export type createRegistrationInput =  z.infer<typeof createRegistrationSchema>;
export const cancelRegistrationSchema = z.object({
  userId: z.number().int("User ID must be an integer"),
  eventId: z.number().int("Event ID must be an integer"),
});
export type cancelRegistrationInput= z.infer<typeof cancelRegistrationSchema>;