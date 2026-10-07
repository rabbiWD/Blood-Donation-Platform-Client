"use client";

import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  CreditCard,
  HelpCircle,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { paymentService } from "@/lib/api/payment.service";

const PRESET_AMOUNTS = [
  {
    amount: 200,
    label: "৳200",
    desc: "Sterile blood bag & donor refreshments",
  },
  {
    amount: 500,
    label: "৳500",
    desc: "Cross-matching screening & testing reagents",
    popular: true,
  },
  {
    amount: 1000,
    label: "৳1,000",
    desc: "Complete emergency transfusion pack for trauma",
  },
  {
    amount: 2500,
    label: "৳2,500",
    desc: "Subsidizes 2 indigent patient transfusions in ICU",
  },
];

export default function DonatePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [payerNote, setPayerNote] = useState<string>("");

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  const paymentMutation = useMutation({
    mutationFn: (amount: number) =>
      paymentService.initiatePayment({
        amount,
        currency: "BDT",
        gateway: "BKASH",
        payerReference: payerNote || undefined,
      }),
    onSuccess: (res) => {
      if (res.bkashURL) {
        toast.success("Redirecting to bKash Sandbox Checkout...", {
          description:
            "Please complete your payment securely on the bKash portal.",
        });
        window.location.href = res.bkashURL;
      } else {
        toast.error("Could not obtain bKash checkout URL. Please try again.");
      }
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to initiate payment";
      toast.error(msg);
    },
  });

  const handleDonate = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in first to contribute securely.", {
        description: "Redirecting to login...",
      });
      router.push("/login?redirect=/donate");
      return;
    }

    if (
      !effectiveAmount ||
      Number.isNaN(effectiveAmount) ||
      effectiveAmount < 10
    ) {
      toast.error("Please enter a valid donation amount of at least ৳10.");
      return;
    }

    paymentMutation.mutate(effectiveAmount);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 text-primary text-xs px-3 py-1"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Lifesaving Medical Relief Fund
        </Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Support Emergency Blood Transfusion Kits
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          While voluntary blood donation is 100% free, critical clinical
          screening, viral marker testing, and sterile consumables require
          funding for underprivileged patients in Bangladesh.
        </p>
      </div>

      {/* Main Donation Card */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Amount Selector */}
        <div className="space-y-4">
          <p className="text-sm font-bold font-heading text-foreground block">
            Select Contribution Amount (BDT)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PRESET_AMOUNTS.map((preset) => {
              const isSelected =
                !customAmount && selectedAmount === preset.amount;

              return (
                <button
                  type="button"
                  key={preset.amount}
                  onClick={() => {
                    setSelectedAmount(preset.amount);
                    setCustomAmount("");
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary shadow-sm"
                      : "border-border/60 bg-card hover:border-primary/40"
                  }`}
                >
                  {preset.popular && (
                    <span className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Popular
                    </span>
                  )}
                  <span className="font-heading text-2xl font-black text-foreground">
                    {preset.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {preset.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div className="pt-2 space-y-1.5">
            <Label
              htmlFor="custom-amount-input"
              className="text-xs font-medium text-muted-foreground block"
            >
              Or enter custom amount (৳):
            </Label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                ৳
              </span>
              <Input
                id="custom-amount-input"
                type="number"
                min={10}
                max={100000}
                placeholder="e.g. 1500"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        {/* Payer Reference Note */}
        <div className="space-y-2">
          <Label
            htmlFor="payer-note-input"
            className="text-xs font-medium text-muted-foreground block"
          >
            Donor Dedication / Reference (Optional)
          </Label>
          <Input
            id="payer-note-input"
            placeholder="e.g. In honor of late grandmother, or Emergency Fund"
            value={payerNote}
            onChange={(e) => setPayerNote(e.target.value)}
          />
        </div>

        {/* bKash Payment Trigger */}
        <div className="p-6 rounded-2xl bg-linear-to-r from-pink-500/10 via-rose-500/5 to-primary/10 border border-pink-500/20 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                bK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    bKash Tokenized Sandbox Checkout
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-pink-500/10 text-pink-600 border-pink-500/30"
                  >
                    Official Sandbox
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct tokenized bKash merchant gateway with instant SSL
                  confirmation.
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-xs text-muted-foreground block">
                Total Amount
              </span>
              <span className="font-heading text-2xl font-black text-foreground">
                ৳{effectiveAmount ? effectiveAmount.toLocaleString() : "0"}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleDonate}
            disabled={paymentMutation.isPending}
            className="w-full bg-[#E2136E] hover:bg-[#c20f5e] text-white font-bold text-base h-12 shadow-md transition-all active:scale-[0.99]"
          >
            {paymentMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Connecting to bKash Sandbox...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay ৳{effectiveAmount ? effectiveAmount.toLocaleString() : "0"}{" "}
                with bKash
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-center text-xs text-amber-600 dark:text-amber-400">
              Note: You will be prompted to log in before checkout initiation.
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>bKash Authorized Merchant Sandbox</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-primary shrink-0" />
            <span>256-bit End-to-End SSL Security</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
            <span>DGHS Healthcare Compliance</span>
          </div>
        </div>
      </div>

      {/* Transparency FAQ */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Transparency & Fund Utilization
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
            <h4 className="font-semibold text-foreground text-sm">
              Where do monetary donations go?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              100% of donations are allocated directly to laboratory screening
              kits (HIV, Hepatitis B/C, Syphilis, Malaria) and anti-coagulated
              sterile blood collection bags for destitute patients admitted to
              public hospitals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
            <h4 className="font-semibold text-foreground text-sm">
              Is my bKash PIN safe?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Yes. All payment credentials and OTP verification happen strictly
              on bKash's official secure gateway. This platform never views,
              transmits, or stores your personal wallet PIN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
