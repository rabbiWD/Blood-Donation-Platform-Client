"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_NAV, type INavLink } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DashboardRole = keyof typeof DASHBOARD_NAV;

const ROLE_LABELS: Record<DashboardRole, string> = {
  ADMIN: "Administrator",
  DONOR: "Blood Donor",
  PATIENT: "Patient",
};

interface SidebarNavProps {
  userRole: DashboardRole;
  onNavigate?: () => void;
}

function isActive(pathname: string, link: INavLink, roleRoot: string) {
  return link.href === roleRoot
    ? pathname === roleRoot
    : pathname.startsWith(link.href);
}

/** Shared nav list used by both the desktop sidebar and the mobile sheet. */
export function SidebarNav({ userRole, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const links = DASHBOARD_NAV[userRole];
  const roleRoot = links[0].href;

  return (
    <nav
      className="flex flex-col gap-1"
      aria-label={`${ROLE_LABELS[userRole]} menu`}
    >
      {links.map((link) => {
        const active = isActive(pathname, link, roleRoot);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
              active &&
                "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {Icon ? <Icon className="size-4" aria-hidden /> : null}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ userRole }: { userRole: DashboardRole }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-sidebar p-4 lg:flex">
      <div className="flex items-center justify-between px-2 pt-1">
        <Logo />
      </div>
      <Badge variant="secondary" className="w-fit">
        {ROLE_LABELS[userRole]}
      </Badge>
      <SidebarNav userRole={userRole} />
    </aside>
  );
}

export { ROLE_LABELS };
export type { DashboardRole };
