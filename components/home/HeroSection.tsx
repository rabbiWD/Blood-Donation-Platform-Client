import {
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
          className="object-cover object-right lg:object-[85%_center] opacity-100"
        />
        {/* Left-side backdrop overlay ensuring crisp text readability while leaving right side 100% visible */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-linear-to-r from-background via-background/95 to-transparent dark:from-background dark:via-background/95 dark:to-transparent" />
        {/* Subtle bottom edge blend */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Decorative ambient gradient on left only */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-primary/10 blur-3xl"
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
        </div>
      </div>
    </section>
  );
}
