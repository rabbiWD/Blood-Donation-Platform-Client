import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DonorLayout({ children }: { children: ReactNode }) {
  return <DashboardShell userRole="DONOR">{children}</DashboardShell>;
}
