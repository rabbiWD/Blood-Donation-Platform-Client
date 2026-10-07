import { Droplet } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16">
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
        <Droplet className="size-8 animate-bounce fill-current" aria-hidden />
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-heading text-base font-semibold text-foreground">
          LifeLink
        </p>
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading life-saving data...
        </p>
      </div>
    </div>
  );
}
