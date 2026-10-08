"use client";

import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Does donating blood make me weak or sick?",
    a: "No. The human body contains roughly 5 liters of blood, and a standard donation takes only about 450ml (less than 10%). Your blood fluid (plasma) recovers within 24 to 48 hours with normal hydration, and red blood cells fully regenerate within 3 to 4 weeks.",
  },
  {
    q: "How often can I safely donate blood?",
    a: "Healthy adult men can safely donate whole blood every 3 months (90 days), while adult women can donate every 4 months (120 days). Platelet apheresis donations can be performed more frequently.",
  },
  {
    q: "Can I donate if I have a tattoo or ear piercing?",
    a: "Yes, provided the tattoo or piercing was performed with sterile equipment at least 6 months ago. This safety window ensures complete freedom from transmissible pathogens.",
  },
  {
    q: "How does LifeLink protect donor privacy and prevent phone spam?",
    a: "LifeLink requires platform authentication before accessing direct donor coordinates and telephone numbers. Public visitors cannot scrape full donor contact information, keeping voluntary lifesavers safe from spam.",
  },
  {
    q: "Does LifeLink charge any fees for connecting patients with donors?",
    a: "Absolutely not. LifeLink is a 100% voluntary, non-profit emergency humanitarian network. Blood donation and donor coordination are strictly free.",
  },
];

export function BloodDonationFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 sm:py-20 border-b bg-background relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <MessageCircleQuestion className="size-3.5" />
            Common Inquiries & Myth Busters
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear, medically accurate answers to common concerns about voluntary
            blood donation and coordination on LifeLink.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.q}
                className="rounded-2xl border bg-card transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-heading font-semibold text-sm sm:text-base hover:text-primary transition-colors gap-4"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 text-muted-foreground ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t pt-3 bg-muted/10">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border bg-muted/30 p-6 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Have more questions about blood matching or platform features?
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/about">Learn More About LifeLink</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/contact">Contact Support Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
