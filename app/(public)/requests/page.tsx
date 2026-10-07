"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, PlusCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { RequestCard } from "@/components/requests/RequestCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { CardGridSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlFilter } from "@/hooks/useUrlFilter";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import { BLOOD_GROUP_LABELS, URGENCY_LABELS } from "@/lib/constants";
import { BLOOD_GROUPS, URGENCY_LEVELS } from "@/types";

function RequestsDirectoryContent() {
  const { get, getNumber, setFilter, reset, hasActiveFilters } = useUrlFilter();

  const search = get("search");
  const bloodGroup = get("bloodGroup");
  const urgency = get("urgency");
  const page = getNumber("page", 1);
  const limit = 9;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blood-requests", { search, bloodGroup, urgency, page }],
    queryFn: () =>
      bloodRequestService.getAll({
        search: search || undefined,
        bloodGroup: bloodGroup || undefined,
        urgency: urgency || undefined,
        page,
        limit,
      }),
  });

  const requests = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 9, total: 0, totalPages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <PageHeader
        title="Emergency Blood Requests Directory"
        description="Browse active patient transfusion requests across Bangladesh. Filter by blood group, urgency, and medical center."
        actions={
          <Button asChild className="gap-2 shadow-md">
            <Link href="/patient/new-request">
              <PlusCircle className="size-4" />
              Post Emergency Request
            </Link>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={search}
            onSearch={(val) => setFilter("search", val)}
            placeholder="Search patient, hospital, city..."
            className="sm:col-span-2 lg:col-span-2"
          />

          {/* Blood Group Filter */}
          <Select
            value={bloodGroup || "ALL"}
            onValueChange={(val) =>
              setFilter("bloodGroup", val === "ALL" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Blood Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {BLOOD_GROUP_LABELS[bg]} ({bg.replace("_", " ")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Urgency Filter */}
          <Select
            value={urgency || "ALL"}
            onValueChange={(val) =>
              setFilter("urgency", val === "ALL" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Urgency Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Urgencies</SelectItem>
              {URGENCY_LEVELS.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {URGENCY_LABELS[lvl]} Urgency
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters ? (
          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>Filters applied from URL</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="h-7 gap-1 text-xs text-primary"
            >
              <RotateCcw className="size-3" />
              Reset All Filters
            </Button>
          </div>
        ) : null}
      </div>

      {/* Content State */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          <AlertCircle className="mx-auto size-8 mb-2" />
          <p className="font-semibold">Unable to load blood requests</p>
          <p className="text-xs mt-1">
            {error instanceof Error ? error.message : "Please check connection"}
          </p>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No Blood Requests Found"
          description="There are currently no active emergency requests matching your chosen filters."
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={reset}>
                Clear Search Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/patient/new-request">Create First Request</Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages || 1}
            total={meta.total}
          />
        </>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<CardGridSkeleton count={6} />}>
      <RequestsDirectoryContent />
    </Suspense>
  );
}
