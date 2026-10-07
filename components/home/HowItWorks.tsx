import { ArrowRight, CheckCircle2, HeartPulse, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Post Urgent Request or Search",
    description:
      "Patients or attendants specify required blood group, hospital location, and urgency. Our system maps nearby donors instantly.",
    icon: Search,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    step: "02",
    title: "Smart Compatibility Match",
    description:
      "Eligible voluntary donors with matching antigens receive urgent notifications with hospital coordinates and contact details.",
    icon: HeartPulse,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    step: "03",
    title: "Direct Safe Transfusion",
    description:
      "Donor arrives at the designated medical facility. Hospital staff verifies cross-matching and proceeds with life-saving transfusion.",
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Simple 3-Step Lifecycle
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How LifeLink Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            No middleman, no commercial blood banking fees. Just transparent,
            voluntary lifesavers reaching patients in their darkest hour.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl ${step.color}`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="font-heading text-3xl font-extrabold text-muted-foreground/30">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground flex-1">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/requests">
              <span>View Active Blood Requests</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
