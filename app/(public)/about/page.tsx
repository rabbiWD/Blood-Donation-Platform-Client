import {
  CheckCircle2,
  Droplet,
  Heart,
  HelpCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us & Compatibility Matrix",
  description:
    "Learn about LifeLink's humanitarian mission, donor eligibility guidelines, and detailed blood compatibility rules.",
};

const DETAILED_MATRIX = [
  {
    type: "O-",
    giveRedCells: "All Blood Types (Universal Donor)",
    receiveRedCells: "O- only",
    givePlasma: "O- only",
    receivePlasma: "All Blood Types (Universal Plasma Recipient)",
    prevalence: "Rare (approx. 1.5% in BD)",
  },
  {
    type: "O+",
    giveRedCells: "O+, A+, B+, AB+",
    receiveRedCells: "O+, O-",
    givePlasma: "O+, A+, B+, AB+",
    receivePlasma: "O+, A+, B+, AB+",
    prevalence: "Most Common (approx. 33% in BD)",
  },
  {
    type: "A-",
    giveRedCells: "A-, A+, AB-, AB+",
    receiveRedCells: "A-, O-",
    givePlasma: "A-, O-",
    receivePlasma: "A-, A+, AB-, AB+",
    prevalence: "Rare (approx. 2% in BD)",
  },
  {
    type: "A+",
    giveRedCells: "A+, AB+",
    receiveRedCells: "A+, A-, O+, O-",
    givePlasma: "A+, AB+",
    receivePlasma: "A+, O+",
    prevalence: "Common (approx. 24% in BD)",
  },
  {
    type: "B-",
    giveRedCells: "B-, B+, AB-, AB+",
    receiveRedCells: "B-, O-",
    givePlasma: "B-, O-",
    receivePlasma: "B-, B+, AB-, AB+",
    prevalence: "Rare (approx. 3% in BD)",
  },
  {
    type: "B+",
    giveRedCells: "B+, AB+",
    receiveRedCells: "B+, B-, O+, O-",
    givePlasma: "B+, AB+",
    receivePlasma: "B+, O+",
    prevalence: "Very Common (approx. 31% in BD)",
  },
  {
    type: "AB-",
    giveRedCells: "AB-, AB+",
    receiveRedCells: "AB-, A-, B-, O-",
    givePlasma: "AB- only",
    receivePlasma: "All Blood Types",
    prevalence: "Extremely Rare (approx. 0.8% in BD)",
  },
  {
    type: "AB+",
    giveRedCells: "AB+ only",
    receiveRedCells: "All Blood Types (Universal Recipient)",
    givePlasma: "All Blood Types (Universal Plasma Donor)",
    receivePlasma: "AB+ only",
    prevalence: "Uncommon (approx. 4.7% in BD)",
  },
];

const ELIGIBILITY_RULES = [
  {
    title: "Age & Weight",
    desc: "Age between 18 and 60 years. Minimum body weight of 48 kg for males and 45 kg for females.",
  },
  {
    title: "Donation Interval",
    desc: "At least 90 days (3 months) for men and 120 days (4 months) for women since the last whole blood donation.",
  },
  {
    title: "Health & Vital Signs",
    desc: "Hemoglobin at least 12.5 g/dL. Normal blood pressure (systolic 100-140 mmHg, diastolic 60-90 mmHg).",
  },
  {
    title: "Medications & Vaccines",
    desc: "No fever, active cold/flu, or antibiotic therapy within 7 days. Must be free from major cardiac or transmissible infections.",
  },
];

const FAQS = [
  {
    q: "How long does the blood donation process take?",
    a: "The actual blood collection takes only 8–10 minutes. The total visit, including mini-health screening, hydration, and brief post-donation rest, takes about 30 minutes.",
  },
  {
    q: "Will donating blood make me weak or sick?",
    a: "No. Your body naturally replenishes the lost plasma volume within 24–48 hours, and red blood cells are fully regenerated within several weeks. Drinking water and having a meal before donation ensures a smooth experience.",
  },
  {
    q: "Does LifeLink charge any fee for connecting donors?",
    a: "No! LifeLink is 100% free and voluntary. We strictly prohibit commercial trade or fees of any kind. Voluntary blood donation is a noble humanitarian act.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <PageHeader
        title="About LifeLink & Compatibility Matrix"
        description="Our mission is to ensure no patient in Bangladesh ever loses their life due to a shortage of compatible emergency blood."
        actions={
          <Button asChild size="lg">
            <Link href="/register">Join as Voluntary Donor</Link>
          </Button>
        }
      />

      {/* Mission & Vision Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <Heart className="size-5 fill-current" />
            </div>
            <CardTitle className="font-heading text-lg">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            To provide an instantaneous, zero-cost digital bridge between
            critically ill patients and selfless voluntary blood donors across
            all 64 districts of Bangladesh.
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="font-heading text-lg">
              Hospital Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            We collaborate with medical facilities, hospital attendants, and
            certified pathology labs to ensure emergency requests are genuine
            and fulfilled with the highest safety standards.
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-2">
              <Users className="size-5" />
            </div>
            <CardTitle className="font-heading text-lg">
              Community Powered
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Every donation milestone is recorded. Active voluntary lifesavers
            receive digital certificates and badges recognizing their selfless
            service to humanity.
          </CardContent>
        </Card>
      </section>

      {/* Complete Blood Compatibility Matrix */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Droplet className="size-3.5 fill-current" />
            Medical Reference Guide
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Detailed Blood & Plasma Compatibility Matrix
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Antigens on red blood cells dictate compatibility. Cross-matching at
            the hospital laboratory is always conducted prior to final
            transfusion.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-5 py-4">Blood Group</th>
                  <th className="px-5 py-4">Can Donate Red Cells To</th>
                  <th className="px-5 py-4">Can Receive Red Cells From</th>
                  <th className="px-5 py-4">Plasma Donor Compatibility</th>
                  <th className="px-5 py-4">Frequency in BD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DETAILED_MATRIX.map((row) => (
                  <tr
                    key={row.type}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-heading font-bold text-base text-primary">
                      {row.type}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {row.giveRedCells}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.receiveRedCells}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {row.givePlasma}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-muted-foreground">
                      {row.prevalence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Donor Eligibility Checklist */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Who Is Eligible to Donate?
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Before donating, check these standard medical criteria recommended
            by the World Health Organization and the Directorate General of
            Health Services (DGHS).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ELIGIBILITY_RULES.map((rule) => (
            <Card key={rule.title} className="border bg-card">
              <CardContent className="pt-6 space-y-2">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <h3 className="font-heading text-base font-bold text-foreground">
                  {rule.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Common Questions & FAQs */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Everything you need to know about first-time donation and patient
            request safety.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {FAQS.map((faq) => (
            <Card key={faq.q} className="border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-base flex items-start gap-2">
                  <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl border bg-muted/40 p-8 text-center sm:p-12 space-y-4">
        <h3 className="font-heading text-2xl font-bold">
          Ready to Make a Life-Saving Difference?
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Whether you can donate a pint of blood today or help someone in your
          family, your participation strengthens the emergency shield of our
          country.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/register">Register as Donor</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Emergency Helplines</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
