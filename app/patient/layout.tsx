import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <DashboardShell userRole="PATIENT">{children}</DashboardShell>;
}
