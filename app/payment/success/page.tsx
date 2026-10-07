"use client";

import {
  CheckCircle2,
  Home,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID") || "BK-SANDBOX-SUCCESS";
  const trxID = searchParams.get("trxID") || paymentID;
  const amount = searchParams.get("amount") || "500";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-20 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="relative inline-block">
        <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-3 py-1"
        >
          bKash Transaction Verified
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Thank You For Your Donation!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your voluntary monetary contribution has been recorded. It directly
          funds sterile consumable kits and emergency testing reagents for
          indigent patients.
        </p>
      </div>

      {/* Official Transaction Receipt Card */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 text-left shadow-sm space-y-4 print:border-black print:m-0">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Amount Contributed
            </span>
            <p className="font-heading text-3xl font-black text-foreground mt-0.5">
              ৳{Number(amount).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                BDT
              </span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center font-bold text-xs border border-pink-600/20">
            bKash
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Transaction Reference
            </span>
            <span className="font-mono font-semibold text-foreground break-all">
              {trxID}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px]">
              Gateway Payment ID
            </span>
            <span className="font-mono font-medium text-muted-foreground break-all">
              {paymentID}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px]">
              Payment Status
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Completed & Settled
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px]">
              Date & Timestamp
            </span>
            <span className="font-medium text-foreground">
              {new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
          Official Digital Receipt · Emergency Disaster Relief Fund · DGHS
          Protocol
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="w-full sm:w-auto border-border/60"
        >
          <Printer className="h-4 w-4 mr-1.5" />
          Print Receipt
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button
            size="sm"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Verifying transaction...
          </p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
