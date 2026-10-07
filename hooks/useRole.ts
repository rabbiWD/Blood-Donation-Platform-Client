"use client";

import type { Role } from "@/types";
import { useAuth } from "./useAuth";

export function useRole() {
  const { role, isAuthenticated } = useAuth();

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isDonor = role === "DONOR";
  const isPatient = role === "PATIENT";

  const hasRole = (...allowedRoles: Role[]) => {
    if (!role || !isAuthenticated) return false;
    return allowedRoles.includes(role);
  };

  return {
    role,
    isAdmin,
    isDonor,
    isPatient,
    hasRole,
  };
}
