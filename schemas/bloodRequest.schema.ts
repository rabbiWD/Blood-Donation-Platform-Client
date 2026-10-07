import { z } from "zod";
import { BLOOD_GROUPS, URGENCY_LEVELS } from "@/types";

export const step1PatientSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    message: "Please select a valid blood group",
  }),
  unitsNeeded: z
    .number()
    .int()
    .min(1, "At least 1 unit is required")
    .max(10, "Cannot request more than 10 units at once"),
});

export const step2HospitalSchema = z.object({
  hospitalName: z
    .string()
    .min(3, "Hospital name must be at least 3 characters"),
  hospitalAddress: z
    .string()
    .min(5, "Hospital address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
});

export const step3UrgencySchema = z.object({
  urgency: z.enum(URGENCY_LEVELS, {
    message: "Please select an urgency level",
  }),
  neededBy: z
    .string()
    .min(1, "Please specify the date and time blood is needed"),
  additionalNotes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export const createBloodRequestSchema = step1PatientSchema
  .merge(step2HospitalSchema)
  .merge(step3UrgencySchema);

export type CreateBloodRequestFormData = z.infer<
  typeof createBloodRequestSchema
>;
export type Step1PatientFormData = z.infer<typeof step1PatientSchema>;
export type Step2HospitalFormData = z.infer<typeof step2HospitalSchema>;
export type Step3UrgencyFormData = z.infer<typeof step3UrgencySchema>;
