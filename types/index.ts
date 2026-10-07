/**
 * Domain types mirroring the backend Prisma schema.
 * Dates arrive as ISO strings over JSON.
 */

export const ROLES = ["SUPER_ADMIN", "ADMIN", "DONOR", "PATIENT"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "BLOCKED", "DELETED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const URGENCY_LEVELS = ["CRITICAL", "HIGH", "STANDARD"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const REQUEST_STATUSES = [
  "PENDING",
  "VERIFIED",
  "MATCHED",
  "FULFILLED",
  "CANCELLED",
  "EXPIRED",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const MATCH_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED",
  "CANCELLED",
] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_GATEWAYS = ["STRIPE", "BKASH", "SSLCOMMERZ"] as const;
export type PaymentGateway = (typeof PAYMENT_GATEWAYS)[number];

export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export interface IDonorProfile {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  contactNumber: string;
  address: string;
  city: string;
  district: string;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  createdAt: string;
  updatedAt: string;
  user?: Pick<IUser, "id" | "name" | "profileImage">;
}

export interface IPatientProfile {
  id: string;
  userId: string;
  contactNumber: string | null;
  address: string | null;
  hospitalName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  donorProfile?: IDonorProfile | null;
  patientProfile?: IPatientProfile | null;
}

export interface IBloodRequest {
  id: string;
  requesterId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  district: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  neededBy: string;
  additionalNotes: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  requester?: Pick<IUser, "id" | "name" | "profileImage">;
  matches?: IDonorAssignment[];
}

export interface IDonorAssignment {
  id: string;
  requestId: string;
  donorId: string;
  status: MatchStatus;
  respondedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  bloodRequest?: IBloodRequest;
  donor?: Pick<IUser, "id" | "name" | "profileImage"> & {
    donorProfile?: IDonorProfile | null;
  };
}

export interface IPayment {
  id: string;
  userId: string;
  requestId: string | null;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  transactionId: string;
  status: PaymentStatus;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLog {
  id: string;
  userId: string | null;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
  user?: Pick<IUser, "id" | "name" | "email"> | null;
}

/** Standard API response envelopes */
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IPaginated<T> {
  data: T[];
  meta: IPaginationMeta;
}
