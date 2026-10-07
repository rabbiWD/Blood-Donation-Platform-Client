import { Droplet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Droplet className="size-8 fill-current" aria-hidden />
      </span>
      <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Every drop of blood can save a life
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Find eligible donors, post urgent requests and respond to emergencies
        near you.
      </p>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/requests">View Requests</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/donors">Find Donors</Link>
        </Button>
      </div>
    </section>
  );
}
