"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, HeartHandshake, MapPin, Users } from "lucide-react";
import CountUp from "react-countup";
import { StatCard } from "@/components/shared/StatCard";
import { donorService } from "@/lib/api/donor.service";

export function ImpactStats() {
  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: donorService.getPlatformStats,
    staleTime: 60 * 1000,
  });

  const livesSaved = stats?.livesSaved ?? 1840;
  const activeDonors = stats?.activeDonors ?? 950;
  const districtsCovered = stats?.districtsCovered ?? 64;
  const avgResponseTime = stats?.avgResponseTimeMinutes ?? 12;

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
            value={
              <span>
                <CountUp
                  end={livesSaved}
                  duration={2.5}
                  separator=","
                  enableScrollSpy
                  scrollSpyOnce
                />
                +
              </span>
            }
            icon={HeartHandshake}
            hint="Verified hospital transfusions"
          />
          <StatCard
            label="Active Voluntary Donors"
            value={
              <span>
                <CountUp
                  end={activeDonors}
                  duration={2.5}
                  separator=","
                  enableScrollSpy
                  scrollSpyOnce
                />
                +
              </span>
            }
            icon={Users}
            hint="Across all 8 blood groups"
          />
          <StatCard
            label="Districts Covered"
            value={
              <CountUp
                end={districtsCovered}
                duration={2}
                enableScrollSpy
                scrollSpyOnce
              />
            }
            icon={MapPin}
            hint="Nationwide rapid coverage"
          />
          <StatCard
            label="Avg Response Time"
            value={
              <span>
                <CountUp
                  end={avgResponseTime}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                />{" "}
                Mins
              </span>
            }
            icon={Clock}
            hint="From request to donor match"
          />
        </div>
      </div>
    </section>
  );
}
