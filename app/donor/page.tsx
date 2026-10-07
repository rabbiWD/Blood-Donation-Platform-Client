"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Heart,
  Hospital,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import { userService } from "@/lib/api/user.service";

export default function DonorDashboardPage() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: userService.getMe,
  });

  const { data: compatibleRequests, isLoading: isRequestsLoading } = useQuery({
    queryKey: ["donor", "compatible-requests"],
    queryFn: bloodRequestService.getCompatibleRequests,
  });

  const donorProfile = user?.donorProfile;

  // Toggle availability mutation
  const availabilityMutation = useMutation({
    mutationFn: (newStatus: boolean) =>
      userService.updateDonorProfile({ isAvailable: newStatus }),
    onSuccess: (updatedProfile) => {
      if (user) {
        queryClient.setQueryData(["auth", "me"], {
          ...user,
          donorProfile: updatedProfile,
        });
      }
      toast.success(
        updatedProfile.isAvailable
          ? "You are now marked AVAILABLE for emergency blood requests!"
          : "You are now marked UNAVAILABLE. Rest well!",
      );
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update availability";
      toast.error(msg);
    },
  });

  const handleToggleAvailability = (checked: boolean) => {
    availabilityMutation.mutate(checked);
  };

  // Cooldown calculation (90 days interval)
  const lastDonationDate = donorProfile?.lastDonationDate
    ? new Date(donorProfile.lastDonationDate)
    : null;
  const daysSinceLastDonation = lastDonationDate
    ? Math.floor(
        (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;
  const daysRemaining =
    daysSinceLastDonation !== null
      ? Math.max(0, 90 - daysSinceLastDonation)
      : 0;
  const isEligibleNow = daysRemaining === 0;

  const totalDonations = donorProfile?.totalDonations || 0;
  const livesImpacted = totalDonations * 3;

  if (isUserLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Donor Dashboard"
        description="Monitor your donation lifecycle, availability status, and compatible emergency requests."
        actions={
          <div className="flex items-center gap-3">
            <Link href="/donor/compatible">
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Droplet className="h-4 w-4 mr-1.5" />
                Compatible Requests ({compatibleRequests?.length || 0})
              </Button>
            </Link>
          </div>
        }
      />

      {/* Donor Banner with Live Availability Switch */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-r from-card via-card to-primary/5 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <Droplet className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {user?.name}
                </h2>
                {donorProfile?.bloodGroup && (
                  <BloodGroupBadge group={donorProfile.bloodGroup} size="sm" />
                )}
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    donorProfile?.isAvailable
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                      donorProfile?.isAvailable
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  {donorProfile?.isAvailable
                    ? "Ready to Donate"
                    : "Resting / Unavailable"}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {donorProfile?.city || "City not set"},{" "}
                  {donorProfile?.district || "District not set"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {donorProfile?.contactNumber || "Contact not set"}
                </span>
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-xl border border-border/50 self-start md:self-auto">
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">
                Live Donor Status
              </p>
              <p className="text-[11px] text-muted-foreground">
                {donorProfile?.isAvailable
                  ? "Visible in emergency searches"
                  : "Hidden from match queries"}
              </p>
            </div>
            <Switch
              checked={donorProfile?.isAvailable ?? true}
              onCheckedChange={handleToggleAvailability}
              disabled={availabilityMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Donations"
          value={totalDonations}
          hint="Verified hospital transfusions"
          icon={Heart}
        />
        <StatCard
          label="Estimated Lives Saved"
          value={livesImpacted}
          hint="~3 lives saved per whole blood unit"
          icon={Users}
        />
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Eligibility Status</span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`text-xl font-bold font-heading ${
                isEligibleNow
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {isEligibleNow ? "Eligible Now" : `In ${daysRemaining} Days`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEligibleNow
                ? "Safe to donate whole blood"
                : "Rest period (90 days cooldown)"}
            </p>
          </div>
        </div>
        <StatCard
          label="Donor Milestone"
          value={
            totalDonations >= 10
              ? "Platinum Hero"
              : totalDonations >= 5
                ? "Gold LifeSaver"
                : totalDonations >= 2
                  ? "Silver Guardian"
                  : "Bronze Donor"
          }
          hint={`${totalDonations} completed donations`}
          icon={Award}
        />
      </div>

      {/* Live Compatible Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Compatible Emergency Requests
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time patient requests matching your blood group (
              {donorProfile?.bloodGroup}).
            </p>
          </div>
          <Link href="/donor/compatible">
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              View All ({compatibleRequests?.length || 0})
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {isRequestsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : !compatibleRequests || compatibleRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-foreground">
              No Pending Emergency Requests Right Now
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              There are currently no unmatched emergency requests for{" "}
              {donorProfile?.bloodGroup}. Keep your notifications enabled!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatibleRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <BloodGroupBadge group={req.bloodGroup} size="sm" />
                    <UrgencyBadge urgency={req.urgency} />
                  </div>

                  <div>
                    <h4 className="font-heading font-semibold text-sm text-foreground">
                      {req.patientName}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Hospital className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <span className="truncate">{req.hospitalName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <span className="truncate">
                        {req.city}, {req.district}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(req.neededBy).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Link href="/donor/compatible">
                    <Button
                      size="xs"
                      className="bg-primary text-primary-foreground text-xs"
                    >
                      Respond
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety & Pre-Donation Guidelines */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Health & Safety Checklist Before Donating
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Hydration
            </p>
            <p>
              Drink at least 500ml of water or fresh fruit juice 1 hour before
              donating.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Balanced
              Meal
            </p>
            <p>
              Eat an iron-rich meal (spinach, eggs, fish). Avoid fatty or fried
              foods right before.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Quality Rest
            </p>
            <p>
              Ensure 7-8 hours of sound sleep the night before your transfusion
              session.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" /> Avoid Nicotine
            </p>
            <p>
              Refrain from smoking 2 hours before and after the blood drawing
              process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
