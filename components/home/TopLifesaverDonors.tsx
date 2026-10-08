"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, CheckCircle2, ChevronRight, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { donorService } from "@/lib/api/donor.service";

export function TopLifesaverDonors() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-top-donors"],
    queryFn: () =>
      donorService.getEligibleDonors({
        limit: 4,
        page: 1,
        isAvailable: "true",
      }),
  });

  const donors = data?.data || [];

  return (
    <section className="py-16 sm:py-20 border-b bg-muted/15 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Award className="size-3.5" />
              Lifesaver Recognition
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Verified Voluntary Donors Ready to Help
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Meet dedicated community lifesavers who stand ready to respond
              when every minute counts.
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/donors">
              <span>Find Donors in Your City</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-56 rounded-2xl border bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : donors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {donors.map((donor) => {
              const name = donor.user?.name || "Voluntary Lifesaver";
              const initials = name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <Card
                  key={donor.id}
                  className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border bg-card"
                >
                  <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <Avatar className="size-16 border-2 border-primary/20">
                        {donor.user?.profileImage ? (
                          <AvatarImage
                            src={donor.user.profileImage}
                            alt={name}
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className="absolute bottom-0 right-0 size-4 rounded-full bg-emerald-500 border-2 border-background"
                        title="Available Now"
                      />
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                        <MapPin className="size-3" />
                        <span>
                          {donor.city}, {donor.district}
                        </span>
                      </p>
                    </div>

                    <BloodGroupBadge group={donor.bloodGroup} size="sm" />

                    <div className="w-full pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <Heart className="size-3.5 text-primary fill-primary" />
                        {donor.totalDonations} Donations
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300"
                      >
                        <CheckCircle2 className="size-2.5 mr-1" />
                        Available
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
