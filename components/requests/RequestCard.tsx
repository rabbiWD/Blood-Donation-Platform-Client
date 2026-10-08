"use client";

import {
  AlertCircle,
  Building,
  Clock,
  Heart,
  Loader2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import type { IBloodRequest } from "@/types";

export function RequestCard({ request }: { request: IBloodRequest }) {
  const { role, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const neededDate = new Date(request.neededBy).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRespond = async () => {
    if (!isAuthenticated) {
      toast.info("Please login as a donor to respond to blood requests");
      return;
    }

    if (role !== "DONOR") {
      toast.warning("Only registered blood donors can respond to requests");
      return;
    }

    try {
      setIsResponding(true);
      await bloodRequestService.acceptRequest(request.id);
      toast.success(
        "Response submitted! The patient has been notified of your support.",
      );
      setOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to respond";
      toast.error(msg);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <BloodGroupBadge group={request.bloodGroup} size="sm" />
          <UrgencyBadge urgency={request.urgency} />
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            {request.patientName}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-primary">
              {request.unitsNeeded}{" "}
              {request.unitsNeeded === 1 ? "Unit" : "Units"}
            </span>{" "}
            Required
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 text-xs text-muted-foreground flex-1">
        <div className="flex items-start gap-2">
          <Building className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <span className="truncate font-medium text-foreground">
            {request.hospitalName}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <span className="truncate">
            {request.city}, {request.district}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <span suppressHydrationWarning>Needed by: {neededDate}</span>
        </div>

        {request.additionalNotes ? (
          <p className="mt-2 rounded-lg bg-muted/40 p-2 text-[11px] italic text-muted-foreground line-clamp-2">
            &ldquo;{request.additionalNotes}&rdquo;
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 font-semibold" size="sm">
              <Heart className="size-3.5 fill-current" />
              Respond as Donor
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <BloodGroupBadge group={request.bloodGroup} size="sm" />
                <UrgencyBadge urgency={request.urgency} />
              </div>
              <DialogTitle className="font-heading text-xl">
                Emergency Blood Request
              </DialogTitle>
              <DialogDescription>
                Review details and confirm your voluntary availability to donate
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-sm">
              <div className="rounded-xl border bg-muted/30 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold text-foreground">
                    {request.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Needed:</span>
                  <span className="font-semibold text-primary">
                    {request.bloodGroup.replace("_", " ")} (
                    {request.unitsNeeded} Units)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hospital:</span>
                  <span className="font-medium text-foreground text-right">
                    {request.hospitalName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-muted-foreground text-right">
                    {request.hospitalAddress}, {request.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Needed By:</span>
                  <span
                    suppressHydrationWarning
                    className="font-semibold text-foreground"
                  >
                    {neededDate}
                  </span>
                </div>
              </div>

              {request.additionalNotes ? (
                <div className="rounded-lg border bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-semibold mb-1">Attendant Note:</p>
                  <p>{request.additionalNotes}</p>
                </div>
              ) : null}

              {!isAuthenticated ? (
                <div className="rounded-lg border bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    You must be logged in as a registered donor to accept this
                    request.
                  </span>
                </div>
              ) : null}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {isAuthenticated && role === "DONOR" ? (
                <Button
                  onClick={handleRespond}
                  disabled={isResponding}
                  className="gap-2"
                >
                  {isResponding ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Heart className="size-4 fill-current" />
                      Confirm Donation Commitment
                    </>
                  )}
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/login">Login to Respond</Link>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
