"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const URGENT_ALERTS = [
  {
    blood: "O-",
    location: "Dhaka Medical College",
    urgency: "CRITICAL",
    time: "10m ago",
  },
  {
    blood: "AB-",
    location: "Square Hospital, Panthapath",
    urgency: "CRITICAL",
    time: "25m ago",
  },
  {
    blood: "B+",
    location: "Chittagong Medical College",
    urgency: "HIGH",
    time: "40m ago",
  },
  {
    blood: "A+",
    location: "Rajshahi Sadar Hospital",
    urgency: "STANDARD",
    time: "1h ago",
  },
];

export function UrgentTicker() {
  return (
    <div className="border-y bg-red-500/10 py-2.5 text-xs text-foreground dark:bg-red-950/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-heading font-semibold text-primary shrink-0">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-600" />
          </span>
          <AlertCircle className="size-3.5" />
          <span>URGENT ALERTS:</span>
        </div>

        <div className="flex flex-1 items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-muted-foreground">
          {URGENT_ALERTS.map((alert, idx) => (
            <div
              key={`${alert.blood}-${idx}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {alert.blood}
              </span>
              <span className="text-foreground font-medium">
                {alert.location}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({alert.time})
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/requests"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0 text-xs"
        >
          View All
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
