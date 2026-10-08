import {
  ArrowRight,
  Droplet,
  Heart,
  PhoneCall,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b py-16 sm:py-24">
      {/* Background Image Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/blood-img.jpg"
          alt="LifeLink blood donation network"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-80 dark:opacity-70"
        />
        {/* Directional gradient: clean contrast for left-side text while letting the image shine on the center & right */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/65 to-background/20 dark:from-background dark:via-background/75 dark:to-background/35" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* Decorative ambient gradients */}
      <div
        className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-red-600/5 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              Bangladesh&apos;s Emergency Blood Network
            </div>

            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Every Second Counts.{" "}
              <span className="bg-linear-to-r from-primary to-red-700 bg-clip-text text-transparent">
                Every Drop Heals.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0">
              LifeLink bridges the gap between critical blood requests and
              verified voluntary donors in real time. Search compatible blood
              groups, request urgent units, and save lives across 64 districts.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                asChild
                size="lg"
                className="gap-2 shadow-lg shadow-primary/25"
              >
                <Link href="/requests">
                  <Droplet className="size-4 fill-current" />
                  Request Blood Urgently
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/donors">
                  <Search className="size-4" />
                  Find Donors
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="gap-2 text-primary hover:bg-primary/10"
              >
                <a href="tel:16263">
                  <PhoneCall className="size-4" />
                  Hotline: 16263
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-muted/80 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">
                  Hospital Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">
                  100% Voluntary
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-blue-600 shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">
                  Real-time Matching
                </span>
              </div>
            </div>
          </div>

          {/* Quick Emergency Action Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border bg-card/90 backdrop-blur-md p-6 shadow-2xl shadow-primary/10 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
                    <Droplet className="size-5 fill-current" />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-bold">
                      Need Blood Fast?
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Average response time under 15 minutes
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                  LIVE
                </span>
              </div>

              <div className="space-y-4 py-5">
                <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      1. Check Compatibility
                    </span>
                    <span className="text-muted-foreground">All 8 Groups</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Instantly view available voluntary donors matching your
                    exact patient blood group.
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      2. Post Emergency Request
                    </span>
                    <span className="text-primary font-bold">No Charge</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send immediate notifications to active registered donors in
                    your district or hospital.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full justify-between" size="lg">
                  <Link href="/patient/new-request">
                    <span>Create Blood Request</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                  size="sm"
                >
                  <Link href="/register">
                    <span>Register as a Lifesaver Donor</span>
                    <Heart className="size-4 text-primary" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
