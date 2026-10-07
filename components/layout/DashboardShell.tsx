"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
  type DashboardRole,
  DashboardSidebar,
  ROLE_LABELS,
  SidebarNav,
} from "@/components/layout/DashboardSidebar";
import { Logo } from "@/components/layout/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/store/hooks";

export function DashboardShell({
  userRole,
  children,
}: {
  userRole: DashboardRole;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen flex-1">
      <DashboardSidebar userRole={userRole} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open dashboard menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <SidebarNav
                    userRole={userRole}
                    onNavigate={() => setOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-heading text-sm font-semibold text-muted-foreground">
              {ROLE_LABELS[userRole]} Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Visit Site</Link>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                {user?.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {user ? (
                <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                  {user.name}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 bg-muted/20 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
