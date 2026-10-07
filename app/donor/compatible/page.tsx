"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Droplet,
  Heart,
  HeartHandshake,
  Hospital,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { CardGridSkeleton } from "@/components/shared/Skeletons";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUrlFilter } from "@/hooks/useUrlFilter";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import { userService } from "@/lib/api/user.service";
import type { IBloodRequest } from "@/types";

function CompatibleRequestsContent() {
  const queryClient = useQueryClient();
  const { get, setFilter } = useUrlFilter();

  const searchQuery = get("search", "");
  const urgencyFilter = get("urgency", "ALL");

  const [selectedRequest, setSelectedRequest] = useState<IBloodRequest | null>(
    null,
  );
  const [pledgedSuccessRequest, setPledgedSuccessRequest] =
    useState<IBloodRequest | null>(null);

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: userService.getMe,
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["donor", "compatible-requests"],
    queryFn: bloodRequestService.getCompatibleRequests,
  });

  const donorProfile = user?.donorProfile;

  // Accept / Pledge Mutation
  const acceptMutation = useMutation({
    mutationFn: (requestId: string) =>
      bloodRequestService.acceptRequest(requestId),
    onSuccess: () => {
      if (selectedRequest) {
        setPledgedSuccessRequest(selectedRequest);
      }
      setSelectedRequest(null);
      toast.success("Thank you! Your donation pledge has been confirmed.", {
        description:
          "The patient has been notified and expects your assistance.",
      });
      queryClient.invalidateQueries({
        queryKey: ["donor", "compatible-requests"],
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to accept blood request";
      toast.error(msg);
    },
  });

  // Client-side filtering across search & urgency
  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter((req) => {
      // Urgency filter
      if (urgencyFilter !== "ALL" && req.urgency !== urgencyFilter) {
        return false;
      }
      // Search filter (patient name, hospital, city, district)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = req.patientName.toLowerCase().includes(query);
        const matchesHospital = req.hospitalName.toLowerCase().includes(query);
        const matchesCity = req.city.toLowerCase().includes(query);
        const matchesDistrict = req.district.toLowerCase().includes(query);
        if (
          !matchesName &&
          !matchesHospital &&
          !matchesCity &&
          !matchesDistrict
        ) {
          return false;
        }
      }
      return true;
    });
  }, [requests, searchQuery, urgencyFilter]);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Compatible Emergency Requests"
        description={`Displaying active emergency transfusion requests compatible with your blood group (${donorProfile?.bloodGroup || "Pending"}).`}
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search hospital, city, or district..."
            value={searchQuery}
            onSearch={(val: string) => setFilter("search", val)}
          />
        </div>

        {/* Urgency Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(["ALL", "CRITICAL", "HIGH", "STANDARD"] as const).map((urg) => {
            const isSelected = urgencyFilter === urg;
            return (
              <button
                type="button"
                key={urg}
                onClick={() => setFilter("urgency", urg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card hover:bg-muted text-muted-foreground border-border/60"
                }`}
              >
                {urg === "ALL" ? "All Urgencies" : urg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Compatible Requests */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No Compatible Requests Found"
          description={
            searchQuery || urgencyFilter !== "ALL"
              ? "Try adjusting your search query or urgency filter to see other matching opportunities."
              : `There are currently no active emergency requests matching blood group ${donorProfile?.bloodGroup || ""}. Check back shortly!`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-4">
                {/* Header: Blood group & Urgency */}
                <div className="flex items-center justify-between">
                  <BloodGroupBadge group={request.bloodGroup} size="md" />
                  <UrgencyBadge urgency={request.urgency} />
                </div>

                {/* Patient & Units */}
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {request.patientName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs font-medium">
                      <Droplet className="h-3 w-3 mr-1 text-primary" />
                      {request.unitsNeeded}{" "}
                      {request.unitsNeeded > 1 ? "Units Needed" : "Unit Needed"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(request.neededBy).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Hospital & Location */}
                <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/40">
                  <p className="font-medium text-foreground flex items-start gap-1.5">
                    <Hospital className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{request.hospitalName}</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-muted-foreground/80 pl-5">
                    <span>{request.hospitalAddress}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium text-foreground/90 pl-5">
                    <MapPin className="h-3 w-3 text-muted-foreground/60" />
                    <span>
                      {request.city}, {request.district}
                    </span>
                  </p>
                </div>

                {/* Notes if present */}
                {request.additionalNotes && (
                  <p className="text-xs text-muted-foreground/90 line-clamp-2 italic bg-muted/10 p-2 rounded-lg border border-border/20">
                    "{request.additionalNotes}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Status:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 capitalize">
                    {request.status.toLowerCase()}
                  </strong>
                </span>
                <Button
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                >
                  <HeartHandshake className="h-4 w-4 mr-1.5" />
                  Accept & Pledge
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation & Pledge Modal */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading text-lg">
              <Heart className="h-5 w-5 text-primary" />
              Confirm Blood Donation Pledge
            </DialogTitle>
            <DialogDescription>
              Please verify your readiness to donate for this patient.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold text-foreground">
                    {selectedRequest.patientName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Blood Group:</span>
                  <BloodGroupBadge
                    group={selectedRequest.bloodGroup}
                    size="sm"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hospital:</span>
                  <span className="font-medium text-foreground text-right max-w-[200px] truncate">
                    {selectedRequest.hospitalName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">
                    {selectedRequest.city}, {selectedRequest.district}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Required By:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {new Date(selectedRequest.neededBy).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-xl text-xs space-y-1 text-foreground/90">
                <p className="font-semibold text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Donor Commitment
                </p>
                <p className="text-muted-foreground">
                  By clicking "Confirm Pledge", you commit to visiting the
                  hospital and donating blood. The patient will be notified
                  immediately.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRequest(null)}
              disabled={acceptMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (selectedRequest) {
                  acceptMutation.mutate(selectedRequest.id);
                }
              }}
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Confirm Pledge
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Details Dialog after Pledge */}
      <Dialog
        open={!!pledgedSuccessRequest}
        onOpenChange={(open) => !open && setPledgedSuccessRequest(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-heading text-lg">
              Pledge Successfully Registered!
            </DialogTitle>
            <DialogDescription className="text-center">
              You are a hero. Here is the patient destination information:
            </DialogDescription>
          </DialogHeader>

          {pledgedSuccessRequest && (
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {pledgedSuccessRequest.hospitalName}
                </p>
                <p className="text-muted-foreground">
                  {pledgedSuccessRequest.hospitalAddress}
                </p>
                <p className="text-muted-foreground">
                  {pledgedSuccessRequest.city}, {pledgedSuccessRequest.district}
                </p>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold text-foreground">
                    {pledgedSuccessRequest.patientName}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold">Next Steps</p>
                <p className="mt-0.5">
                  Please proceed to the hospital blood bank or transfusion unit
                  before the required deadline. State the patient name at
                  reception.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-primary text-primary-foreground"
              size="sm"
              onClick={() => setPledgedSuccessRequest(null)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CompatibleRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <CardGridSkeleton count={6} />
        </div>
      }
    >
      <CompatibleRequestsContent />
    </Suspense>
  );
}
