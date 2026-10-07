import { z } from "zod";
import { BLOOD_GROUPS } from "@/types";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters long"),
    email: z
      .string({ message: "Email is required" })
      .email("Please enter a valid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string({ message: "Confirm your password" }),
    role: z.enum(["DONOR", "PATIENT"]),
    donor: z
      .object({
        bloodGroup: z.enum(BLOOD_GROUPS),
        contactNumber: z.string().min(1, "Contact number is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        district: z.string().min(1, "District is required"),
        isAvailable: z.boolean().default(true),
      })
      .optional(),
    patient: z
      .object({
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        hospitalName: z.string().optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "DONOR") {
        return !!data.donor?.bloodGroup && !!data.donor?.contactNumber;
      }
      return true;
    },
    {
      message: "Donor details are required for Donor accounts",
      path: ["donor", "bloodGroup"],
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;
