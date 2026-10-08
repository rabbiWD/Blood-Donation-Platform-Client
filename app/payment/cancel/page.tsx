"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  HelpCircle,
  Home,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID");
  const message = searchParams.get("message");
  const [copied, setCopied] = useState(false);

  const handleCopyPaymentId = () => {
    if (!paymentID) return;
    navigator.clipboard.writeText(paymentID);
    setCopied(true);
    toast.success("Payment Reference ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-20 space-y-8">
      {/* Visual Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md animate-in zoom-in-75 duration-300">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-background border-2 border-amber-500 text-amber-500 flex items-center justify-center shadow-sm text-xs font-bold">
            !
          </div>
        </div>

        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-3 py-1 font-semibold"
          >
            bKash Transaction Cancelled
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Donation Cancelled
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {message ||
              "Your payment process was cancelled before completion. No balance was deducted from your bKash wallet."}
          </p>
        </div>
      </div>

      {/* Safety Reassurance Card */}
      <Card className="border border-border/70 shadow-sm overflow-hidden">
        <div className="bg-amber-500/5 dark:bg-amber-500/10 px-6 py-3.5 border-b border-amber-500/15 flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
          <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Wallet Safety Guarantee: ৳0.00 Charged</span>
        </div>

        <CardContent className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-muted-foreground text-xs block">
                Payment Channel
              </span>
              <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                <span className="inline-block size-2 rounded-full bg-pink-600" />
                bKash Tokenized Sandbox
              </span>
            </div>

            <div>
              <span className="text-muted-foreground text-xs block">
                Resolution Status
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5 block">
                User Cancelled / Abandoned
              </span>
            </div>
          </div>

          {paymentID && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 border border-border/60">
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Payment Reference ID:
                </span>
                <span className="font-mono text-xs text-foreground font-semibold truncate block">
                  {paymentID}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyPaymentId}
                className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Copy Payment ID"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          <div className="space-y-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground block">
              Why might this happen?
            </span>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] sm:text-xs">
              <li>
                You pressed &ldquo;Cancel&rdquo; or closed the bKash checkout
                popup.
              </li>
              <li>The verification code (OTP) or PIN request timed out.</li>
              <li>
                Network interruption between your browser and the gateway.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 shadow-md"
          >
            <Link href="/donate">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Donation Again
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border/70 hover:bg-muted/60"
          >
            <Link href="/donors">
              <Users className="h-4 w-4 mr-2" />
              Find Blood Donors
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Return Home
          </Link>
          <span>·</span>
          <Link
            href="/contact"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Need Assistance? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
