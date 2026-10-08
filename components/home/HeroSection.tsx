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
    <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background py-16 sm:py-24">
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

          {/* Hero Visual Card with Public Image & Quick Emergency Actions */}
          <div className="relative lg:col-span-5">
            {/* Ambient Background Glow */}
            <div
              className="pointer-events-none absolute -inset-2 rounded-3xl bg-linear-to-tr from-primary/30 via-red-500/20 to-primary/10 blur-2xl opacity-70"
              aria-hidden
            />

            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl transition-all duration-300 hover:shadow-primary/10">
              {/* Image Frame */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted group">
                <Image
                  src="/blood-img.jpg"
                  alt="Blood Donation Volunteers"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

                {/* Live Float Badges over Image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold backdrop-blur-md border border-white/15 shadow-sm">
                    <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Volunteers Ready</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-md">
                    <Droplet className="size-3 fill-current" />
                    <span>24/7 Response</span>
                  </div>
                </div>
              </div>

              {/* Action Content below Image */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h2 className="font-heading text-base font-bold text-foreground">
                      Need Blood Urgently?
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Average response time under 15 minutes
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                    LIVE
                  </span>
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
      </div>
    </section>
  );
}
