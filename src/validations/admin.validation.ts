import z from "zod";
export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  eventDate: z.string().transform((str) => new Date(str)),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  address: z.string().min(1, "Event address is required"),
  eventStatus: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
  eventType: z.string().min(1, "Event type is required"),
  organizerName: z.string().min(1, "Organizer name is required"),
  organizerContact: z.string().min(1, "Organizer contact is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;
export const updateEventSchema = z.object({
  name: z.string().min(1, "Event name is required").optional(),
  description: z.string().optional(),
  eventDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  startTime: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  endTime: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  address: z.string().min(1, "Event address is required").optional(),
  eventType: z.string().min(1, "Event type is required").optional(),
  eventStatus: z.enum(["active", "completed", "cancelled"]).optional(),
  organizerName: z.string().min(1, "Organizer name is required").optional(),
  organizerContact: z
    .string()
    .min(1, "Organizer contact is required")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export const InviteUserSchema = z.object({
  id: z.number().int().positive("Invalid user ID"),
})
export type InviteUserInput = z.infer<typeof InviteUserSchema>;
export const UpsertUserSchema = createUserSchema.extend({
  id: z.number().int().positive("Invalid user ID").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});
export type UpsertUserInput = z.infer<typeof UpsertUserSchema>;
