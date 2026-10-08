"use client";

import { LayoutDashboard, LogOut, Menu, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_NAV_LINKS, ROLE_HOME } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, isAuthenticated, logout } = useAuth();

  const profileHref =
    role === "DONOR"
      ? "/donor/profile"
      : role === "PATIENT"
        ? "/patient/profile"
        : "/admin/profile";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>

          {isAuthenticated && user && role ? (
            <div className="mx-4 mt-3 mb-2 flex items-center gap-3 rounded-xl border bg-muted/40 p-2.5">
              <Avatar className="size-10 border shadow-xs">
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-foreground">
                  {user.name}
                </p>
                <span className="inline-block rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                  {role}
                </span>
              </div>
            </div>
          ) : null}

          <nav className="flex flex-col gap-1 px-4 mt-2" aria-label="Mobile">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                  pathname === link.href &&
                    "bg-primary/10 text-primary font-semibold",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 font-semibold"
            >
              Donate
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 p-4 border-t">
          {isAuthenticated && role ? (
            <>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href={ROLE_HOME[role]}>
                  <LayoutDashboard className="size-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href={profileHref}>
                  <UserIcon className="size-4 mr-2" />
                  Profile Settings
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
