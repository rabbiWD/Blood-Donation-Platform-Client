import { Droplet } from "lucide-react";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BloodGroup } from "@/types";

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-7 min-w-12 px-2 text-xs gap-1",
  md: "h-9 min-w-14 px-3 text-sm gap-1.5",
  lg: "h-14 min-w-20 px-4 text-xl gap-2",
} as const;

export function BloodGroupBadge({
  group,
  size = "md",
  className,
}: BloodGroupBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading font-bold text-primary",
        SIZES[size],
        className,
      )}
      aria-label={`Blood group ${BLOOD_GROUP_LABELS[group]}`}
    >
      <Droplet className="size-[1em] fill-current" aria-hidden />
      {BLOOD_GROUP_LABELS[group]}
    </span>
  );
}
