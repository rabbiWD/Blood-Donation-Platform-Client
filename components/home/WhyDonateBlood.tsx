import { Activity, Heart, Sparkles, Stethoscope, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Benefit {
  icon: typeof Heart;
  title: string;
  tagline: string;
  description: string;
  colorClass: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Activity,
    title: "Cardiovascular Health",
    tagline: "Reduces Excess Iron",
    description:
      "Regular voluntary blood donation prevents unhealthy iron buildup in the bloodstream, supporting arterial flexibility and cardiovascular wellness.",
    colorClass:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  {
    icon: Stethoscope,
    title: "Free Mini Health Check",
    tagline: "Vital Screenings",
    description:
      "Every donation includes free screening of blood pressure, pulse rate, hemoglobin levels, and blood group verification by certified personnel.",
    colorClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Fresh Cell Regeneration",
    tagline: "Natural Renewal",
    description:
      "Donating stimulates your bone marrow to produce fresh, healthy red blood cells, rejuvenating your circulatory system within 30 to 60 days.",
    colorClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Heart,
    title: "Save Up to 3 Lives",
    tagline: "Tripled Impact",
    description:
      "A single standard donation of 450ml can be separated into red cells, platelets, and plasma, helping up to three distinct patients in need.",
    colorClass:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export function WhyDonateBlood() {
  return (
    <section className="py-16 sm:py-20 border-b bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Science & Humanitarian Impact
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Why Voluntary Blood Donation Matters
          </h2>
          <p className="text-sm text-muted-foreground">
            Donating blood is not only an act of selflessness that saves lives,
            it also offers tangible health benefits to the donor.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6 space-y-3">
                  <div
                    className={`inline-flex size-12 items-center justify-center rounded-2xl border ${item.colorClass} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="size-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.tagline}
                    </span>
                    <h3 className="font-heading font-bold text-base text-foreground mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
