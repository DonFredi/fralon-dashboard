import { z } from "zod";

export const walkInCustomerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

export type WalkInCustomerInput = z.infer<typeof walkInCustomerSchema>;
