"use client";

import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IDonorProfile } from "@/types";

export function DonorCard({ donor }: { donor: IDonorProfile }) {
  const [open, setOpen] = useState(false);

  const donorName = donor.user?.name || "Voluntary Donor";
  const initials = donorName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const lastDonation = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "First-time lifesaver";

  return (
    <Card className="flex flex-col justify-between border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 border">
            {donor.user?.profileImage ? (
              <AvatarImage src={donor.user.profileImage} alt={donorName} />
            ) : null}
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold truncate text-foreground">
              {donorName}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="truncate">
                {donor.city}, {donor.district}
              </span>
            </p>
          </div>
        </div>

        <BloodGroupBadge group={donor.bloodGroup} size="sm" />
      </CardHeader>

      <CardContent className="space-y-3 text-xs text-muted-foreground flex-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status:</span>
          {donor.isAvailable ? (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-400 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-3" />
              Available to Donate
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            >
              <Clock className="size-3" />
              Resting / Unavailable
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="size-3.5 text-primary" />
            Completed Donations:
          </span>
          <span className="font-semibold text-foreground">
            {donor.totalDonations}{" "}
            {donor.totalDonations === 1 ? "Time" : "Times"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-muted-foreground" />
            Last Transfusion:
          </span>
          <span className="font-medium text-foreground">{lastDonation}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 font-semibold"
            >
              <Phone className="size-3.5 text-primary" />
              Contact Donor
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="size-12 border">
                  {donor.user?.profileImage ? (
                    <AvatarImage
                      src={donor.user.profileImage}
                      alt={donorName}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="font-heading text-lg">
                    {donorName}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    Registered Blood Lifesaver
                  </p>
                </div>
                <div className="ml-auto">
                  <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                </div>
              </div>
              <DialogDescription>
                Emergency contact information for voluntary blood coordination
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-sm">
              <div className="rounded-xl border bg-muted/30 p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">
                    Direct Phone:
                  </span>
                  <a
                    href={`tel:${donor.contactNumber}`}
                    className="font-mono text-base font-bold text-primary hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="size-4" />
                    {donor.contactNumber}
                  </a>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Address Area:</span>
                  <span className="font-medium text-foreground text-right">
                    {donor.address}, {donor.city}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">District:</span>
                  <span className="font-medium text-foreground">
                    {donor.district}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Total Donations:
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {donor.totalDonations} Lives Touched
                  </span>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">
                  Ethical Guidance:
                </p>
                <p>
                  Please only contact voluntary donors for genuine medical
                  emergencies. Commercial compensation of blood is strictly
                  prohibited.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button asChild className="gap-2">
                <a href={`tel:${donor.contactNumber}`}>
                  <Phone className="size-4" />
                  Call Now
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
