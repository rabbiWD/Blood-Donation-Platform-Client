"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/auth.service";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotMutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) =>
      authService.forgotPassword({ email: data.email }),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      toast.success("Security OTP Dispatched!", {
        description: `A 6-digit verification code was sent to ${variables.email}.`,
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to process forgot password request.";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Forgot Password?
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Enter your registered email address and we'll dispatch a 6-digit
          verification code to reset your credentials.
        </p>
      </div>

      {submittedEmail ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h2 className="font-heading font-semibold text-base text-foreground">
              Verification Code Sent
            </h2>
            <p className="text-xs text-muted-foreground">
              We have dispatched a 6-digit OTP code to:
            </p>
            <p className="text-xs font-mono font-semibold text-foreground bg-muted/40 py-1 px-3 rounded-lg inline-block border border-border/50">
              {submittedEmail}
            </p>
            <p className="text-[11px] text-muted-foreground pt-1">
              The code remains active for 5 minutes. Check your inbox and spam
              folders.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={() =>
                router.push(
                  `/reset-password?email=${encodeURIComponent(submittedEmail)}`,
                )
              }
            >
              Continue to Reset Password
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => setSubmittedEmail(null)}
            >
              Try a different email
            </Button>
          </div>
        </div>
      ) : (
        /* Input Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-9"
                placeholder="name@example.com"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Verification Code...
              </>
            ) : (
              <>
                Send Reset Code
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* Footer navigation */}
      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/80 pt-2 border-t border-border/40">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>End-to-End Encrypted Verification Protocol</span>
      </div>
    </div>
  );
}
