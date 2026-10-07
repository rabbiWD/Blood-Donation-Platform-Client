import { Droplet } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label="LifeLink home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-red-700 text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-110 group-hover:-rotate-6">
        <Droplet className="size-5 fill-current" aria-hidden />
      </span>
      <span className="font-heading text-xl font-bold tracking-tight">
        Life<span className="text-primary">Link</span>
      </span>
    </Link>
  );
}
