"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-inner">
        <AlertTriangle className="size-10" aria-hidden />
      </div>

      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong!
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
        An unexpected error occurred while processing your request. Please try
        refreshing the page or return home.
      </p>

      {process.env.NODE_ENV === "development" && error.message ? (
        <div className="mt-4 max-w-lg overflow-x-auto rounded-lg border bg-muted/60 p-3 text-left font-mono text-xs text-destructive">
          {error.message}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} size="lg" className="gap-2">
          <RefreshCw className="size-4" aria-hidden />
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
