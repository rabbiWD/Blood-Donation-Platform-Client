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

export const updateDonorProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),
  contactNumber: z
    .string()
    .regex(
      /^(\+8801|01)[3-9]\d{8}$/,
      "Must be a valid Bangladeshi phone number (e.g. 01712345678)",
    ),
  address: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  isAvailable: z.boolean(),
  lastDonationDate: z.string().optional().or(z.literal("")),
});

export type UpdateDonorProfileFormData = z.infer<
  typeof updateDonorProfileSchema
>;
