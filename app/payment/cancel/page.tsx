"use client";

import { Home, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID");
  const message = searchParams.get("message");

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
      {/* Icon */}
      <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
        <XCircle className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-3 py-1"
        >
          Payment Cancelled
        </Badge>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Donation Process Incomplete
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {message ||
            "You cancelled the payment or closed the bKash checkout window. No balance was deducted from your wallet."}
        </p>
      </div>

      {paymentID && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground font-mono">
          Session ID: {paymentID}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link href="/donate" className="w-full sm:w-auto">
          <Button
            size="sm"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Try Donation Again
          </Button>
        </Link>
        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto border-border/60"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
