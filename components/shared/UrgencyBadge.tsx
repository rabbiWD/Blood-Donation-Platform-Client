import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { URGENCY_LABELS, URGENCY_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/types";

const ICONS = {
  CRITICAL: AlertTriangle,
  HIGH: Clock,
  STANDARD: ShieldCheck,
} as const;

export function UrgencyBadge({
  urgency,
  className,
}: {
  urgency: UrgencyLevel;
  className?: string;
}) {
  const Icon = ICONS[urgency];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-semibold",
        URGENCY_STYLES[urgency],
        urgency === "CRITICAL" && "animate-pulse",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {URGENCY_LABELS[urgency]}
    </Badge>
  );
}
