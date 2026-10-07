import { Clock, HeartHandshake, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

export function ImpactStats() {
  return (
    <section className="py-12 sm:py-16 bg-muted/20 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Real Lives. Real Impact.
          </h2>
          <p className="text-sm text-muted-foreground">
            Together, voluntary donors and responsive communities turn emergency
            distress into survival every single day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Lives Saved & Transfused"
            value="1,840+"
            icon={HeartHandshake}
            hint="Verified hospital transfusions"
          />
          <StatCard
            label="Active Voluntary Donors"
            value="950+"
            icon={Users}
            hint="Across all 8 blood groups"
          />
          <StatCard
            label="Districts Covered"
            value="64"
            icon={MapPin}
            hint="Nationwide rapid coverage"
          />
          <StatCard
            label="Avg Response Time"
            value="12 Mins"
            icon={Clock}
            hint="From request to donor match"
          />
        </div>
      </div>
    </section>
  );
}
