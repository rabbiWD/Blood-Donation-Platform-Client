"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Calendar,
  CheckCircle2,
  Droplet,
  FileBadge2,
  Heart,
  Lock,
  Printer,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/lib/api/user.service";

interface IMilestone {
  tier: string;
  minDonations: number;
  color: string;
  desc: string;
}

const MILESTONES: IMilestone[] = [
  {
    tier: "Bronze LifeSaver",
    minDonations: 1,
    color:
      "from-amber-700/20 to-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-600/30",
    desc: "First blood donation milestone",
  },
  {
    tier: "Silver Guardian",
    minDonations: 3,
    color:
      "from-slate-400/20 to-slate-600/10 text-slate-700 dark:text-slate-300 border-slate-400/40",
    desc: "3+ donations (Up to 9 lives touched)",
  },
  {
    tier: "Gold LifeShield",
    minDonations: 5,
    color:
      "from-yellow-500/20 to-amber-500/10 text-amber-600 dark:text-amber-400 border-yellow-500/40",
    desc: "5+ donations (Up to 15 lives saved)",
  },
  {
    tier: "Platinum Hero",
    minDonations: 10,
    color: "from-primary/20 to-rose-600/10 text-primary border-primary/40",
    desc: "10+ lifetime donations (Elite humanitarian honor)",
  },
];

export default function DonationHistoryPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: userService.getMe,
  });

  const donorProfile = user?.donorProfile;
  const totalDonations = donorProfile?.totalDonations || 0;
  const livesImpacted = totalDonations * 3;

  // Determine current milestone tier
  let currentMilestone = MILESTONES[0];
  let nextMilestone: IMilestone | null = MILESTONES[1];

  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (totalDonations >= MILESTONES[i].minDonations) {
      currentMilestone = MILESTONES[i];
      nextMilestone = MILESTONES[i + 1] || null;
      break;
    }
  }

  const nextTierTarget = nextMilestone ? nextMilestone.minDonations : 10;
  const progressPercent = nextMilestone
    ? Math.min(100, Math.round((totalDonations / nextTierTarget) * 100))
    : 100;

  const handlePrintCertificate = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Donation Milestones & Recognition"
        description="Review your lifetime blood donation record, milestone tier progression, and digital certificate of appreciation."
        actions={
          totalDonations > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrintCertificate}
              className="print:hidden border-border/60 hover:bg-muted"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Print Certificate
            </Button>
          ) : undefined
        }
      />

      {/* Milestone Progress Card & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Progress Card */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Current Status
                </p>
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  {totalDonations > 0
                    ? currentMilestone.tier
                    : "Aspiring Donor"}
                  {totalDonations > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-primary/5 text-primary border-primary/30"
                    >
                      Active
                    </Badge>
                  )}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="font-heading text-2xl font-black text-primary">
                {totalDonations}
              </span>
              <span className="text-xs text-muted-foreground block">
                {totalDonations === 1 ? "Donation" : "Donations"}
              </span>
            </div>
          </div>

          {/* Progress Bar towards Next Tier */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>
                {nextMilestone
                  ? `Next Tier: ${nextMilestone.tier}`
                  : "Highest Recognition Achieved!"}
              </span>
              <span>
                {totalDonations} / {nextTierTarget} Donations ({progressPercent}
                %)
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {MILESTONES.map((m) => {
              const isUnlocked = totalDonations >= m.minDonations;
              return (
                <div
                  key={m.tier}
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2 ${
                    isUnlocked
                      ? "border-emerald-500/40 bg-emerald-500/5 text-foreground"
                      : "border-border/40 bg-muted/20 text-muted-foreground opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] truncate">
                      {m.tier.split(" ")[0]}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {m.minDonations}+ Units
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Humanitarian Impact
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-500" /> Lives Touched
                </span>
                <span className="font-bold font-heading text-foreground text-sm">
                  ~{livesImpacted} Lives
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-primary" /> Blood Group
                </span>
                {donorProfile?.bloodGroup && (
                  <BloodGroupBadge group={donorProfile.bloodGroup} size="sm" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" /> Last
                  Donation
                </span>
                <span className="font-medium text-foreground">
                  {donorProfile?.lastDonationDate
                    ? new Date(
                        donorProfile.lastDonationDate,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No record yet"}
                </span>
              </div>
            </div>
          </div>

          <Link href="/donor/compatible" className="w-full">
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Browse Compatible Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Official Certificate of Appreciation (Print-Friendly) */}
      {totalDonations > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between print:hidden">
            <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <FileBadge2 className="h-5 w-5 text-primary" />
              Digital Certificate of Humanitarian Service
            </h3>
            <span className="text-xs text-muted-foreground">
              Official verification document
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border-4 border-double border-amber-600/30 bg-linear-to-b from-card via-card to-amber-500/5 p-8 sm:p-12 shadow-md print:border-black print:shadow-none print:m-0">
            {/* Certificate Decorative Seal */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

            <div className="text-center space-y-6 max-w-2xl mx-auto">
              {/* Header Badges */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Award className="h-6 w-6" />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold tracking-widest text-primary mb-1">
                  Blood Donation Platform Bangladesh
                </p>
                <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  Certificate of Appreciation
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  This official citation is proudly presented in recognition of
                  selfless service to humanity.
                </p>
              </div>

              {/* Recipient */}
              <div className="py-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Awarded to
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground border-b-2 border-primary/30 inline-block px-8 pb-2 mt-1">
                  {user?.name}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                For demonstrating compassionate civic responsibility by donating
                verified units of lifesaving whole blood (
                {donorProfile?.bloodGroup
                  ? donorProfile.bloodGroup.replace("_", " ")
                  : "Blood Group"}
                ). Your contribution has safeguarded patient lives across
                clinical healthcare facilities in Bangladesh.
              </p>

              {/* Stats in Certificate */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Total Transfusions
                  </span>
                  <span className="font-heading font-bold text-base text-foreground">
                    {totalDonations} {totalDonations === 1 ? "Unit" : "Units"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Impact Quotient
                  </span>
                  <span className="font-heading font-bold text-base text-emerald-600 dark:text-emerald-400">
                    ~{livesImpacted} Lives Saved
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-muted-foreground block text-[11px]">
                    Donor Tier
                  </span>
                  <span className="font-heading font-bold text-base text-primary">
                    {currentMilestone.tier}
                  </span>
                </div>
              </div>

              {/* Signatures / Authority Stamp */}
              <div className="pt-8 flex items-center justify-between text-xs border-t border-border/50 text-muted-foreground">
                <div className="text-left space-y-1">
                  <p className="font-semibold text-foreground">
                    Director General
                  </p>
                  <p className="text-[10px]">Medical Services Registry</p>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">
                  VERIFIED
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-foreground">
                    Blood Bank Coordinator
                  </p>
                  <p className="text-[10px]">DGHS Certified Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Donations Recorded Yet"
          description="Once you accept an emergency blood request and complete a hospital transfusion, your milestone tier and official Certificate of Appreciation will appear here."
        />
      )}
    </div>
  );
}
