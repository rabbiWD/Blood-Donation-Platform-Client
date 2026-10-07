import { Droplet, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COMPATIBILITY_DATA = [
  { group: "O-", givesTo: "Everyone (Universal Donor)", receivesFrom: "O-" },
  { group: "O+", givesTo: "O+, A+, B+, AB+", receivesFrom: "O+, O-" },
  { group: "A-", givesTo: "A-, A+, AB-, AB+", receivesFrom: "A-, O-" },
  { group: "A+", givesTo: "A+, AB+", receivesFrom: "A+, A-, O+, O-" },
  { group: "B-", givesTo: "B-, B+, AB-, AB+", receivesFrom: "B-, O-" },
  { group: "B+", givesTo: "B+, AB+", receivesFrom: "B+, B-, O+, O-" },
  { group: "AB-", givesTo: "AB-, AB+", receivesFrom: "AB-, A-, B-, O-" },
  {
    group: "AB+",
    givesTo: "AB+ only",
    receivesFrom: "Everyone (Universal Recipient)",
  },
];

export function CompatibilityGuide() {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Medical Compatibility Guide
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Blood Compatibility Matrix
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Know who you can save and who can donate to you in case of
            emergencies.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-heading font-semibold">
                    Blood Group
                  </th>
                  <th className="px-6 py-4 font-heading font-semibold">
                    Can Donate Red Cells To
                  </th>
                  <th className="px-6 py-4 font-heading font-semibold">
                    Can Receive Red Cells From
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPATIBILITY_DATA.map((item) => (
                  <tr
                    key={item.group}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-3.5 font-heading font-bold text-base text-primary flex items-center gap-2">
                      <Droplet className="size-4 fill-current" />
                      {item.group}
                    </td>
                    <td className="px-6 py-3.5 text-foreground font-medium">
                      {item.givesTo}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {item.receivesFrom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/30 p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-primary shrink-0" />
              <span>
                Universal Donor: <strong>O Negative</strong> · Universal
                Recipient: <strong>AB Positive</strong>
              </span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/about">Learn More in About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
