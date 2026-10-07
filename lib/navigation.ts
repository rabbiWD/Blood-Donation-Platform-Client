import {
  ClipboardList,
  FileText,
  HeartHandshake,
  History,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
  PlusCircle,
  ScrollText,
  UserCircle,
  Users,
} from "lucide-react";
import type { Role } from "@/types";

export interface INavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const PUBLIC_NAV_LINKS: INavLink[] = [
  { label: "Home", href: "/" },
  { label: "Requests", href: "/requests" },
  { label: "Donors", href: "/donors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Landing route for each role after login. */
export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  DONOR: "/donor",
  PATIENT: "/patient",
};

export const DASHBOARD_NAV: Record<"ADMIN" | "DONOR" | "PATIENT", INavLink[]> =
  {
    ADMIN: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    ],
    DONOR: [
      { label: "Dashboard", href: "/donor", icon: LayoutDashboard },
      {
        label: "Compatible Requests",
        href: "/donor/compatible",
        icon: ListChecks,
      },
      { label: "Donation History", href: "/donor/history", icon: History },
    ],
    PATIENT: [
      { label: "My Requests", href: "/patient", icon: ClipboardList },
      { label: "New Request", href: "/patient/new-request", icon: PlusCircle },
      { label: "Profile", href: "/patient/profile", icon: UserCircle },
    ],
  };

export const FOOTER_LINKS: { title: string; links: INavLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Blood Requests", href: "/requests", icon: ClipboardList },
      { label: "Find Donors", href: "/donors", icon: Users },
      { label: "Donate", href: "/donate", icon: HeartHandshake },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about", icon: FileText },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];

export function getDashboardRole(role: Role): "ADMIN" | "DONOR" | "PATIENT" {
  return role === "SUPER_ADMIN" ? "ADMIN" : role;
}
