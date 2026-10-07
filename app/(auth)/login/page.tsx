"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  Mail,
  Shield,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { type LoginInput, loginSchema } from "@/schemas/auth.schema";

interface DemoAccount {
  role: "ADMIN" | "DONOR" | "PATIENT";
  title: string;
  badge: string;
  email: string;
  pass: string;
  icon: typeof Shield;
  colorClass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    title: "Platform Admin",
    badge: "Full Governance",
    email: "admin@blooddonation.com",
    pass: "Admin@123456",
    icon: Shield,
    colorClass:
      "hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-purple-600 dark:text-purple-400",
  },
  {
    role: "DONOR",
    title: "Voluntary Donor",
    badge: "O+ Available",
    email: "donor@blooddonation.com",
    pass: "Donor@123456",
    icon: Heart,
    colorClass:
      "hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400",
  },
  {
    role: "PATIENT",
    title: "Patient / Requester",
    badge: "Emergency Requester",
    email: "patient@blooddonation.com",
    pass: "Patient@123456",
    icon: UserCheck,
    colorClass:
      "hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
    } catch {
      // Error handled by useAuth toast
    }
  };

  const handleDemoLogin = async (account: DemoAccount) => {
    setLoadingRole(account.role);
    setValue("email", account.email);
    setValue("password", account.pass);

    try {
      await login({
        email: account.email,
        password: account.pass,
      });
    } catch {
      // Error handled by useAuth toast
    } finally {
      setLoadingRole(null);
    }
  };

  const isAnyLoading = isSubmitting || loadingRole !== null;

  return (
    <div className="w-full max-w-lg space-y-6">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-heading text-2xl font-bold tracking-tight">
            Welcome Back 👋
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your LifeLink account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Standard Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  disabled={isAnyLoading}
                  {...register("email")}
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  disabled={isAnyLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              size="lg"
              disabled={isAnyLoading}
            >
              {isSubmitting && !loadingRole ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 font-medium text-muted-foreground">
                Or Instant 1-Click Demo Login
              </span>
            </div>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="space-y-3">
            <p className="text-center text-xs text-muted-foreground">
              Select a predefined demo role for instant evaluator access
            </p>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                const isLoadingThis = loadingRole === account.role;

                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={isAnyLoading}
                    onClick={() => handleDemoLogin(account)}
                    className={`group relative flex flex-col items-center justify-center rounded-xl border bg-card p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 ${account.colorClass}`}
                  >
                    <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-background">
                      {isLoadingThis ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                    </div>
                    <span className="font-heading text-xs font-bold text-foreground">
                      {account.title}
                    </span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">
                      {account.badge}
                    </span>
                    <span className="mt-2 block w-full rounded bg-muted/60 py-0.5 text-[9px] font-mono text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                      1-Click Login
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Evaluator Credentials Reference */}
            <div className="rounded-lg border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground">
                Evaluator Credentials:
              </p>
              <div className="mt-1 space-y-0.5 font-mono text-[10px]">
                <p>
                  <strong className="text-foreground">Admin:</strong>{" "}
                  admin@blooddonation.com | Admin@123456
                </p>
                <p>
                  <strong className="text-foreground">Donor:</strong>{" "}
                  donor@blooddonation.com | Donor@123456
                </p>
                <p>
                  <strong className="text-foreground">Patient:</strong>{" "}
                  patient@blooddonation.com | Patient@123456
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="ml-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an Account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
