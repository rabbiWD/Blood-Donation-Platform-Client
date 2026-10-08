"use client";

import {
  Check,
  CheckCircle2,
  Copy,
  Home,
  LayoutDashboard,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE_HOME } from "@/lib/navigation";
import { useAppSelector } from "@/store/hooks";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID") || "BK-SANDBOX-VERIFIED";
  const trxID = searchParams.get("trxID") || paymentID;
  const amount = searchParams.get("amount") || "500";
  const [copied, setCopied] = useState(false);

  const { user, role, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleCopyTrx = () => {
    navigator.clipboard.writeText(trxID);
    setCopied(true);
    toast.success("Transaction ID (TrxID) copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 space-y-8">
      {/* Celebration Icon & Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-3 py-1 font-semibold"
          >
            bKash Transaction Settled & Verified
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Thank You For Your Life-Saving Support!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your voluntary monetary contribution has been recorded in our
            emergency ledger. It directly funds sterile consumable kits and
            emergency reagents for indigent patients.
          </p>
        </div>
      </div>

      {/* Official Transaction Receipt Card */}
      <Card className="border border-border/70 shadow-sm overflow-hidden print:border-black print:shadow-none">
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 px-6 py-4 border-b border-emerald-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Official LifeLink Digital Receipt</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-600/10 text-pink-600 border border-pink-600/20 text-xs font-bold font-mono">
            bKash
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Amount Display */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border/40 pb-5 gap-2">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Total Amount Paid
              </span>
              <div className="font-heading text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                ৳{Number(amount).toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  BDT
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold w-fit text-xs px-2.5 py-1"
            >
              Status: COMPLETED
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px] font-medium">
                Transaction ID (TrxID)
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground text-xs break-all">
                  {trxID}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrx}
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                  title="Copy TrxID"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px] font-medium">
                Gateway Payment ID
              </span>
              <span className="font-mono text-xs text-muted-foreground break-all">
                {paymentID}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px] font-medium">
                Contributor
              </span>
              <span className="font-medium text-foreground text-xs">
                {user?.name || "Anonymous Donor"}{" "}
                {user?.email ? `(${user.email})` : ""}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px] font-medium">
                Timestamp
              </span>
              <span className="font-medium text-foreground text-xs">
                {new Date().toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* DGHS Verification Note */}
          <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Verified DGHS Emergency Disaster Relief Protocol</span>
            <span className="font-mono">
              Audit Hash: #{trxID.slice(-6).toUpperCase()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrint}
          className="w-full sm:w-auto border-border/70 hover:bg-muted/60"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Official Receipt
        </Button>

        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 shadow-md"
        >
          <Link href={isAuthenticated && role ? ROLE_HOME[role] : "/"}>
            {isAuthenticated ? (
              <>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </>
            ) : (
              <>
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
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
