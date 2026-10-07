"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlFilter } from "@/hooks/useUrlFilter";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
}

/** URL-synced pagination — updates `?page=` and preserves other filters. */
export function Pagination({ page, totalPages, total }: PaginationProps) {
  const { setFilter } = useUrlFilter();

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-3 pt-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        {totalPages}
        {total !== undefined ? ` · ${total} results` : null}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setFilter("page", page - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setFilter("page", page + 1)}
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
