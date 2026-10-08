"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Droplet } from "lucide-react";
import Link from "next/link";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";

export function UrgentLiveRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-urgent-requests"],
    queryFn: () =>
      bloodRequestService.getAll({
        limit: 3,
        page: 1,
        sortBy: "neededBy",
        sortOrder: "asc",
      }),
  });

  const requests = data?.data || [];

  return (
    <section className="py-16 sm:py-20 border-b bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
              <span className="flex size-2 rounded-full bg-red-600 animate-ping" />
              Live Emergency Board
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Urgent Blood Requests Needing Immediate Response
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Patients and hospital attendants requiring immediate voluntary
              blood transfusions within the next few hours.
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/requests">
              <span>View All Requests</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl border bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-8 text-center space-y-3">
            <Droplet className="size-8 mx-auto text-muted-foreground" />
            <h3 className="font-heading text-base font-bold">
              No Critical Requests Pending Right Now
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              All ongoing requests are currently matched with lifesaver donors.
              You can post an emergency request if needed.
            </p>
            <Button asChild size="sm">
              <Link href="/patient/new-request">Create Emergency Request</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
