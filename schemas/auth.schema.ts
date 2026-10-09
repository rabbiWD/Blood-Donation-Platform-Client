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
        bloodGroup: z.enum(BLOOD_GROUPS).optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        isAvailable: z.boolean().optional(),
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
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (data.role === "DONOR") {
      if (!data.donor?.bloodGroup) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Blood group is required",
          path: ["donor", "bloodGroup"],
        });
      }
      if (!data.donor?.contactNumber || data.donor.contactNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contact number is required",
          path: ["donor", "contactNumber"],
        });
      }
      if (!data.donor?.district || data.donor.district.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "District is required",
          path: ["donor", "district"],
        });
      }
      if (!data.donor?.city || data.donor.city.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["donor", "city"],
        });
      }
      if (!data.donor?.address || data.donor.address.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address details are required",
          path: ["donor", "address"],
        });
      }
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email address"),
  otp: z
    .string({ message: "OTP code is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must consist of 6 numeric digits"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;


export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email("Please enter a valid email address"),
    otp: z
      .string({ message: "OTP code is required" })
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d{6}$/, "OTP must consist of 6 numeric digits"),
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string({ message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
