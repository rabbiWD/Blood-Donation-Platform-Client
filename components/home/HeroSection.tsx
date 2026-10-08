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

          {/* Hero Visual Card with Background Image */}
          <div className="relative lg:col-span-5">
            {/* Ambient Background Glow */}
            <div
              className="pointer-events-none absolute -inset-2 rounded-3xl bg-linear-to-tr from-primary/30 via-red-500/20 to-primary/10 blur-2xl opacity-70"
              aria-hidden
            />

            <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-primary/20">
              {/* Background Image with Dark Vignette Overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/blood-img.jpg"
                  alt="Blood Donation Lifesavers"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/75 to-black/90 backdrop-blur-[1px]" />
              </div>

              {/* Foreground Content on Top of Background Image */}
              <div className="relative z-10 p-6 sm:p-8 space-y-6 text-white">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                      <Droplet className="size-5 fill-current" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-white tracking-tight">
                        Need Blood Urgently?
                      </h2>
                      <p className="text-xs text-zinc-300">
                        Average response time under 15 minutes
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    LIVE 24/7
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        1. Check Compatibility
                      </span>
                      <span className="text-zinc-300 font-medium">
                        All 8 Groups
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Instantly view available voluntary donors matching your
                      exact patient blood group.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        2. Post Emergency Request
                      </span>
                      <span className="text-emerald-400 font-bold">
                        100% Free
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Send immediate notifications to active registered donors
                      in your district or hospital.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="w-full justify-between font-semibold shadow-lg shadow-primary/30"
                  >
                    <Link href="/patient/new-request">
                      <span>Create Blood Request</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="w-full justify-between font-medium border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md"
                  >
                    <Link href="/register">
                      <span>Register as a Lifesaver Donor</span>
                      <Heart className="size-4 text-red-400" />
                    </Link>
                  </Button>
                </div>

                {/* Micro trust stats badge */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Verified Donors Active
                  </span>
                  <span>Across 64 Districts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
