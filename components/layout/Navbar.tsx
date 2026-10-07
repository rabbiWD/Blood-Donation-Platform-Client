"use client";

import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV_LINKS, ROLE_HOME } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {PUBLIC_NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active &&
                    "text-primary after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/donate">
              <HeartHandshake aria-hidden />
              Donate
            </Link>
          </Button>
          {isAuthenticated && role ? (
            <Button asChild>
              <Link href={ROLE_HOME[role]}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
