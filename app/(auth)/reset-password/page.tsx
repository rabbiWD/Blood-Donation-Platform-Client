"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/auth.service";
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from "@/schemas/auth.schema";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("newPassword") || "";

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      authService.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password Reset Successful!", {
        description: "You can now sign in using your new credentials.",
      });
      router.push("/login");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please verify your OTP code.";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    resetMutation.mutate(data);
  };

  // Live password validation checklist
  const hasLength = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasDigit = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Set New Password
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Enter the 6-digit verification code received in your email along with
          your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold">
            Registered Email <span className="text-destructive">*</span>
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

        {/* 6-Digit OTP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="otp" className="text-xs font-semibold">
              6-Digit Verification Code{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Resend Code?
            </Link>
          </div>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 123456"
            className="tracking-widest font-mono text-center text-lg font-bold"
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-xs font-semibold">
            New Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              className="pl-9 pr-9"
              placeholder="••••••••"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.newPassword.message}
            </p>
          )}

          {/* Password criteria checklist */}
          <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-[11px] space-y-1">
            <p className="font-semibold text-foreground text-[11px] mb-1">
              Password Requirements:
            </p>
            <div className="grid grid-cols-2 gap-1 text-muted-foreground">
              <span className={hasLength ? "text-emerald-600 font-medium" : ""}>
                ✓ 8+ Characters
              </span>
              <span className={hasUpper ? "text-emerald-600 font-medium" : ""}>
                ✓ Uppercase (A-Z)
              </span>
              <span className={hasLower ? "text-emerald-600 font-medium" : ""}>
                ✓ Lowercase (a-z)
              </span>
              <span className={hasDigit ? "text-emerald-600 font-medium" : ""}>
                ✓ Number (0-9)
              </span>
              <span
                className={hasSpecial ? "text-emerald-600 font-medium" : ""}
              >
                ✓ Special symbol (!@#$)
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold">
            Confirm New Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-9 pr-9"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              Reset Password
              <ShieldCheck className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>

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
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-xs text-muted-foreground">
            Loading password reset portal...
          </p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
