import { Heart, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  return (
    <section className="py-16 sm:py-20 bg-linear-to-r from-primary to-red-800 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
          <Heart className="size-3.5 fill-current" />
          Become a Hero in Someone&apos;s Story
        </span>

        <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl max-w-3xl mx-auto">
          One Voluntary Donation Can Save Up to Three Human Lives
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-primary-foreground/90">
          Join our verified donor registry today. It takes less than 2 minutes
          to register, and your commitment can bring a patient back from the
          brink.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="font-bold text-primary shadow-lg"
          >
            <Link href="/register">Register as Donor Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/donate">
              <HeartHandshake className="size-4" />
              Support Platform (bKash)
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
