import z from "zod";
import { createEventSchema } from "./admin.validation";

export const upsertEventSchema = createEventSchema.extend({
  id: z.number().optional(),
});
export type UpsertEventInput = z.infer<typeof upsertEventSchema>;