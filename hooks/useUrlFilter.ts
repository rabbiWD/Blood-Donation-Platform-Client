"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type FilterValue = string | number | null | undefined;

/**
 * Syncs filters, search and pagination with the URL query string.
 * Changing any filter other than `page` resets `page` to 1.
 */
export function useUrlFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string, fallback = ""): string => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number): number => {
      const parsed = Number(searchParams.get(key));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    },
    [searchParams],
  );

  const setFilters = useCallback(
    (updates: Record<string, FilterValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      if (!("page" in updates)) {
        params.delete("page");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const setFilter = useCallback(
    (key: string, value: FilterValue) => setFilters({ [key]: value }),
    [setFilters],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "page",
  );

  return {
    searchParams,
    get,
    getNumber,
    setFilter,
    setFilters,
    reset,
    hasActiveFilters,
  };
}
