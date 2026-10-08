"use client";

import {
  CheckCircle2,
  Heart,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: string;
  question: string;
  details: string;
}

const QUESTIONS: Question[] = [
  {
    id: "age",
    question: "Are you between 18 and 65 years old?",
    details:
      "Medical standard for safe voluntary blood donation in Bangladesh.",
  },
  {
    id: "weight",
    question: "Do you weigh at least 50 kg (110 lbs)?",
    details:
      "Ensures standard 450ml donation volume is completely safe for you.",
  },
  {
    id: "interval",
    question: "Was your last donation at least 90 days ago (or never)?",
    details: "Allows full iron replenishment and red cell regeneration.",
  },
  {
    id: "health",
    question: "Are you feeling healthy and symptom-free today?",
    details: "No acute colds, fever, or antibiotic regimens currently active.",
  },
];

export function DonationEligibilityChecker() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    age: null,
    weight: null,
    interval: null,
    health: null,
  });

  const handleAnswer = (id: string, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setAnswers({
      age: null,
      weight: null,
      interval: null,
      health: null,
    });
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const isEligible =
    allAnswered && Object.values(answers).every((v) => v === true);

  return (
    <section className="py-16 sm:py-20 border-b bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="size-3.5" />
            Instant 30-Second Self Check
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Can You Donate Blood Today?
          </h2>
          <p className="text-sm text-muted-foreground">
            Take this quick self-assessment to find out if you qualify as an
            active lifesaver in under 30 seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {QUESTIONS.map((q) => {
              const currentVal = answers[q.id];

              return (
                <Card
                  key={q.id}
                  className={`transition-all duration-200 border ${
                    currentVal === true
                      ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : currentVal === false
                        ? "border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20"
                        : "bg-card"
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">
                        {q.question}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {q.details}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={currentVal === true ? "default" : "outline"}
                        className={`flex-1 text-xs font-semibold h-8 ${
                          currentVal === true
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : ""
                        }`}
                        onClick={() => handleAnswer(q.id, true)}
                      >
                        <CheckCircle2 className="size-3.5 mr-1" />
                        Yes
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={currentVal === false ? "default" : "outline"}
                        className={`flex-1 text-xs font-semibold h-8 ${
                          currentVal === false
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : ""
                        }`}
                        onClick={() => handleAnswer(q.id, false)}
                      >
                        <XCircle className="size-3.5 mr-1" />
                        No
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Assessment Result Banner */}
          {allAnswered ? (
            <div
              className={`rounded-2xl p-6 border transition-all duration-300 ${
                isEligible
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {isEligible ? (
                    <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                      <UserCheck className="size-6" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading text-lg font-bold">
                      {isEligible
                        ? "🎉 You Are Eligible to Donate Blood Today!"
                        : "⏳ Resting Period or Medical Criteria Needed"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                      {isEligible
                        ? "Your answers meet standard health requirements. Register your profile to be notified when patients near you need compatible blood."
                        : "Thank you for your noble intention! If you recently donated or are recovering, please wait for your resting period to complete."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {isEligible ? (
                    <Button
                      asChild
                      className="w-full sm:w-auto gap-2 font-semibold shadow-md"
                    >
                      <Link href="/register">
                        <Heart className="size-4 fill-current" />
                        Join LifeLink Now
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1.5 text-xs"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Answer all 4 questions above to verify your real-time eligibility.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
