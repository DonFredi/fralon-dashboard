import { z } from "zod";

export const promoteStaffSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type PromoteStaffInput = z.infer<typeof promoteStaffSchema>;
