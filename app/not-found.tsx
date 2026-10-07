import { AlertCircle, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
        <AlertCircle className="size-12" aria-hidden />
        <span className="absolute -bottom-2 -right-2 rounded-full bg-primary px-2.5 py-0.5 font-heading text-xs font-bold text-primary-foreground shadow">
          404
        </span>
      </div>

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/requests">
            <Search className="size-4" aria-hidden />
            Browse Requests
          </Link>
        </Button>
      </div>

      <div className="mt-12 rounded-xl border border-dashed bg-muted/30 p-4 text-xs text-muted-foreground">
        Need urgent emergency blood assistance? Call national helpline:{" "}
        <a
          href="tel:16263"
          className="font-semibold text-primary underline underline-offset-2"
        >
          16263
        </a>
      </div>
    </div>
  );
}
