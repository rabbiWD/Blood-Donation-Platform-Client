"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Lock, LogIn, RotateCcw, UserPlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DonorCard } from "@/components/donors/DonorCard";
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
import { useAuth } from "@/hooks/useAuth";
import { useUrlFilter } from "@/hooks/useUrlFilter";
import { donorService } from "@/lib/api/donor.service";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";
import { BLOOD_GROUPS } from "@/types";

function DonorsDirectoryContent() {
  const { isAuthenticated } = useAuth();
  const { get, getNumber, setFilter, reset, hasActiveFilters } = useUrlFilter();

  const search = get("search");
  const bloodGroup = get("bloodGroup");
  const isAvailable = get("isAvailable");
  const page = getNumber("page", 1);
  const limit = 9;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["eligible-donors", { search, bloodGroup, isAvailable, page }],
    queryFn: () =>
      donorService.getEligibleDonors({
        search: search || undefined,
        bloodGroup: bloodGroup || undefined,
        isAvailable: isAvailable || undefined,
        page,
        limit,
      }),
  });

  const donors = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 9, total: 0, totalPages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <PageHeader
        title="Find Voluntary Blood Donors"
        description="Search verified active lifesavers across Bangladesh. Filter by blood group, district, and immediate availability."
        actions={
          <Button asChild className="gap-2 shadow-md">
            <Link href="/register">
              <UserPlus className="size-4" />
              Register as Donor
            </Link>
          </Button>
        }
      />

      {!isAuthenticated ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
          <div className="flex items-center gap-2.5 text-foreground">
            <Lock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Browsing as Guest:</strong> Donor profiles and districts
              are public. To protect donor privacy, direct phone numbers and
              calling access require login.
            </span>
          </div>
          <Button
            asChild
            size="sm"
            variant="default"
            className="shrink-0 font-semibold h-8 text-xs"
          >
            <Link href="/login">
              <LogIn className="size-3.5 mr-1.5" />
              Log In to Access
            </Link>
          </Button>
        </div>
      ) : null}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={search}
            onSearch={(val) => setFilter("search", val)}
            placeholder="Search donor name, city, district..."
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

          {/* Availability Filter */}
          <Select
            value={isAvailable || "ALL"}
            onValueChange={(val) =>
              setFilter("isAvailable", val === "ALL" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Donors</SelectItem>
              <SelectItem value="true">Available Now</SelectItem>
              <SelectItem value="false">Resting / Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters ? (
          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>Filtered results from URL parameters</span>
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

      {/* Content Grid */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          <AlertCircle className="mx-auto size-8 mb-2" />
          <p className="font-semibold">Unable to load donors directory</p>
          <p className="text-xs mt-1">
            {error instanceof Error ? error.message : "Please check connection"}
          </p>
        </div>
      ) : donors.length === 0 ? (
        <EmptyState
          title="No Compatible Donors Found"
          description="We couldn't find any registered donors matching your selected location or blood group."
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={reset}>
                Clear Search Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/patient/new-request">
                  Post an Emergency Request
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
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

export default function DonorsPage() {
  return (
    <Suspense fallback={<CardGridSkeleton count={6} />}>
      <DonorsDirectoryContent />
    </Suspense>
  );
}
