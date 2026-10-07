import type { BloodGroup, RequestStatus, UrgencyLevel } from "@/types";

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  STANDARD: "Standard",
};

export const URGENCY_STYLES: Record<UrgencyLevel, string> = {
  CRITICAL: "bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30",
  HIGH: "bg-orange-100 text-orange-800 border-orange-300",
  STANDARD: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  MATCHED: "Matched",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const DEFAULT_PAGE_SIZE = 9;
