import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z
    .string()
    .regex(
      /^(\+8801|01)[3-9]\d{8}$/,
      "Must be a valid Bangladeshi phone number",
    )
    .optional()
    .or(z.literal("")),
  address: z.string().max(200, "Address too long").optional().or(z.literal("")),
  hospitalName: z
    .string()
    .max(100, "Hospital name too long")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
