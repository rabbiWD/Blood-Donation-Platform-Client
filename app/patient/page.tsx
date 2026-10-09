"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Heart,
  Loader2,
  Phone,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { StatCard } from "@/components/shared/StatCard";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import type { IBloodRequest } from "@/types";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Awaiting Donors",
    className:
      "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  VERIFIED: {
    label: "Hospital Verified",
    className:
      "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  MATCHED: {
    label: "Donor Matched",
    className:
      "border-purple-400 bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 animate-pulse",
  },
  FULFILLED: {
    label: "Transfusion Completed",
    className:
      "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "border-zinc-300 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export default function PatientDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<IBloodRequest | null>(
    null,
  );
  const [deleteRequestTarget, setDeleteRequestTarget] =
    useState<IBloodRequest | null>(null);

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: bloodRequestService.getMyRequests,
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => bloodRequestService.completeDonation(id),
    onSuccess: () => {
      toast.success("Request marked as fulfilled! Thank you.");
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bloodRequestService.deleteRequest(id),
    onSuccess: () => {
      toast.success("Blood request removed successfully");
      setDeleteRequestTarget(null);
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    },
  });

  // Derived metrics
  const totalRequests = requests.length;
  const activeRequests = requests.filter(
    (r) =>
      r.status === "PENDING" ||
      r.status === "VERIFIED" ||
      r.status === "MATCHED",
  ).length;
  const fulfilledRequests = requests.filter(
    (r) => r.status === "FULFILLED",
  ).length;
  const totalMatches = requests.reduce(
    (acc, r) => acc + (r.matches?.length || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patient Blood Requests Portal"
        description="Track your emergency blood posts, review voluntary donor responses, and coordinate transfusions."
        actions={
          <Button asChild className="gap-2 shadow-md">
            <Link href="/patient/new-request">
              <PlusCircle className="size-4" />
              Create New Blood Request
            </Link>
          </Button>
        }
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={totalRequests}
          icon={Heart}
          hint="All posts created"
        />
        <StatCard
          label="Active Emergencies"
          value={activeRequests}
          icon={Clock}
          hint="Currently seeking donors"
        />
        <StatCard
          label="Donor Responses"
          value={totalMatches}
          icon={Users}
          hint="Lifesavers responded"
        />
        <StatCard
          label="Fulfilled Transfusions"
          value={fulfilledRequests}
          icon={CheckCircle2}
          hint="Safely completed"
        />
      </div>

      {/* My Requests Section */}
      <Card className="border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            My Emergency Requests
          </CardTitle>
          <CardDescription>
            Live list of all patient assistance requests created from your
            account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={4} columns={6} />
          ) : isError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
              <AlertCircle className="mx-auto size-8 mb-2" />
              <p className="font-semibold">Unable to load requests</p>
              <p className="text-xs mt-1">
                {error instanceof Error ? error.message : "Connection failure"}
              </p>
            </div>
          ) : requests.length === 0 ? (
            <EmptyState
              title="No Blood Requests Posted Yet"
              description="When you or your relatives need blood, create an urgent request here to notify nearby donors."
              action={
                <Button asChild>
                  <Link href="/patient/new-request">
                    Post Your First Request
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        Patient & Group
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Hospital & City
                      </th>
                      <th className="px-4 py-3 font-semibold">Urgency</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">
                        Matched Donors
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests.map((req) => {
                      const statusBadge =
                        STATUS_BADGES[req.status] || STATUS_BADGES.PENDING;
                      const hasMatches = (req.matches?.length || 0) > 0;

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <BloodGroupBadge
                                group={req.bloodGroup}
                                size="sm"
                              />
                              <div>
                                <p className="font-heading font-bold text-foreground">
                                  {req.patientName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {req.unitsNeeded}{" "}
                                  {req.unitsNeeded === 1 ? "Unit" : "Units"}{" "}
                                  needed
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <p className="font-medium text-foreground text-xs flex items-center gap-1">
                              <Building className="size-3 text-muted-foreground shrink-0" />
                              <span className="truncate max-w-44">
                                {req.hospitalName}
                              </span>
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {req.city}, {req.district}
                            </p>
                          </td>

                          <td className="px-4 py-3.5">
                            <UrgencyBadge urgency={req.urgency} />
                          </td>

                          <td className="px-4 py-3.5">
                            <Badge
                              variant="outline"
                              className={statusBadge.className}
                            >
                              {statusBadge.label}
                            </Badge>
                          </td>

                          <td className="px-4 py-3.5">
                            {hasMatches ? (
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Users className="size-3.5" />
                                {req.matches?.length}{" "}
                                {req.matches?.length === 1
                                  ? "Donor Ready"
                                  : "Donors Ready"}
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Searching...
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right space-x-2">
                            {req.status !== "FULFILLED" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                                disabled={completeMutation.isPending}
                                onClick={() => completeMutation.mutate(req.id)}
                              >
                                <CheckCircle2 className="size-3.5 mr-1" />
                                Fulfilled
                              </Button>
                            ) : null}

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs text-destructive hover:bg-destructive/10"
                              disabled={deleteMutation.isPending}
                              onClick={() => setDeleteRequestTarget(req)}
                              title="Delete Blood Request"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Matched Donors Modal */}
      {selectedRequest ? (
        <Dialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Matched Donors for {selectedRequest.patientName}
              </DialogTitle>
              <DialogDescription>
                Voluntary lifesavers who have responded to this emergency
                request
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              {selectedRequest.matches?.map((match) => (
                <div
                  key={match.id}
                  className="rounded-xl border bg-card p-3.5 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">
                      {match.donor?.name || "Voluntary Donor"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="size-3" />
                      Contact:{" "}
                      <a
                        href={`tel:${match.donor?.donorProfile?.contactNumber}`}
                        className="font-mono text-primary font-semibold hover:underline"
                      >
                        {match.donor?.donorProfile?.contactNumber ||
                          "Available via platform"}
                      </a>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Location: {match.donor?.donorProfile?.city || "Dhaka"},{" "}
                      {match.donor?.donorProfile?.district || "Dhaka"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Accepted
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="mt-2 text-xs h-7 gap-1"
                    >
                      <a
                        href={`tel:${match.donor?.donorProfile?.contactNumber}`}
                      >
                        <Phone className="size-3" />
                        Call Donor
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      {/* Unique Custom Delete Confirmation Modal */}
      <Dialog
        open={!!deleteRequestTarget}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleteRequestTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-destructive/20 shadow-2xl">
          <div className="relative p-6 pb-4 text-center">
            {/* Top decorative animated danger badge */}
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-xs ring-4 ring-destructive/5 animate-in zoom-in-75 duration-200">
              <Trash2 className="size-7" />
            </div>

            <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
              Delete Blood Request?
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-muted-foreground">
              Are you sure you want to permanently delete this emergency
              request?
            </DialogDescription>

            {/* Target Request Info Card */}
            {deleteRequestTarget ? (
              <div className="mt-4 rounded-xl border bg-muted/40 p-3.5 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <BloodGroupBadge
                      group={deleteRequestTarget.bloodGroup}
                      size="sm"
                    />
                    {deleteRequestTarget.patientName}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {deleteRequestTarget.unitsNeeded}{" "}
                    {deleteRequestTarget.unitsNeeded === 1 ? "Unit" : "Units"}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Building className="size-3 shrink-0" />
                  <span className="truncate">
                    {deleteRequestTarget.hospitalName}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Warning Callout Box */}
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-left text-[11px] text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                This action cannot be undone. Active donors searching the
                network will immediately stop seeing this emergency post.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t bg-muted/30 px-6 py-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => setDeleteRequestTarget(null)}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteRequestTarget) {
                  deleteMutation.mutate(deleteRequestTarget.id);
                }
              }}
              className="gap-1.5 font-semibold shadow-sm"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  Yes, Delete Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
