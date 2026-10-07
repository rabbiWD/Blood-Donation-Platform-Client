"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_NAV_LINKS, ROLE_HOME } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

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
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href && "bg-primary/10 text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Donate
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          {isAuthenticated && role ? (
            <Button asChild onClick={() => setOpen(false)}>
              <Link href={ROLE_HOME[role]}>Go to Dashboard</Link>
            </Button>
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
