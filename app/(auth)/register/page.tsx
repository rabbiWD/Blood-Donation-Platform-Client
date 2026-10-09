"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/lib/api/auth.service";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";
import { ROLE_HOME } from "@/lib/navigation";
import { type RegisterInput, registerSchema } from "@/schemas/auth.schema";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"REGISTER" | "OTP">("REGISTER");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cachedPayload, setCachedPayload] = useState<RegisterInput | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "DONOR",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      donor: {
        bloodGroup: "O_POSITIVE",
        contactNumber: "",
        address: "",
        city: "Dhaka",
        district: "Dhaka",
        isAvailable: true,
      },
      patient: {
        contactNumber: "",
        address: "",
        hospitalName: "",
      },
    },
  });

  const selectedRole = watch("role");
  const selectedBloodGroup = watch("donor.bloodGroup");

  const onInvalid = (formErrors: FieldErrors<RegisterInput>) => {
    if (formErrors.name?.message) {
      toast.error(formErrors.name.message);
      return;
    }
    if (formErrors.email?.message) {
      toast.error(formErrors.email.message);
      return;
    }
    if (formErrors.password?.message) {
      toast.error(formErrors.password.message);
      return;
    }
    if (formErrors.confirmPassword?.message) {
      toast.error(formErrors.confirmPassword.message);
      return;
    }
    if (formErrors.donor) {
      const donorKey = Object.keys(formErrors.donor)[0] as keyof NonNullable<
        RegisterInput["donor"]
      >;
      const donorErr = formErrors.donor[donorKey];
      if (donorErr?.message) {
        toast.error(donorErr.message);
        return;
      }
    }
    toast.error("Please fill in all required fields properly.");
  };

  const onSubmit = async (data: RegisterInput) => {
    try {
      setCachedPayload(data);
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === "DONOR"
          ? {
              donor: {
                bloodGroup: data.donor?.bloodGroup || "O_POSITIVE",
                contactNumber: data.donor?.contactNumber || "",
                address: data.donor?.address || "",
                city: data.donor?.city || "",
                district: data.donor?.district || "",
                isAvailable: data.donor?.isAvailable ?? true,
              },
            }
          : {
              patient: {
                contactNumber: data.patient?.contactNumber || undefined,
                address: data.patient?.address || undefined,
                hospitalName: data.patient?.hospitalName || undefined,
              },
            }),
      });

      setRegisteredEmail(data.email);
      setStep("OTP");
      toast.success(
        "Verification code sent! Please check your email to activate your account.",
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account";
      toast.error(message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await authService.verifyEmail({
        email: registeredEmail,
        otp: otp.trim(),
      });

      if (result.user) {
        dispatch(setSession(result.user));
        toast.success(
          `Account verified! Welcome to LifeLink, ${result.user.name}.`,
        );
        const destination = ROLE_HOME[result.user.role] || "/dashboard";
        router.push(destination);
      } else {
        toast.success("Account verified successfully! Please sign in.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid or expired OTP code";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!cachedPayload) {
      toast.error(
        "Session expired. Please fill out the registration form again.",
      );
      setStep("REGISTER");
      return;
    }

    setIsResending(true);
    try {
      await authService.register({
        name: cachedPayload.name,
        email: cachedPayload.email,
        password: cachedPayload.password,
        role: cachedPayload.role,
        ...(cachedPayload.role === "DONOR"
          ? {
              donor: {
                bloodGroup: cachedPayload.donor?.bloodGroup || "O_POSITIVE",
                contactNumber: cachedPayload.donor?.contactNumber || "",
                address: cachedPayload.donor?.address || "",
                city: cachedPayload.donor?.city || "",
                district: cachedPayload.donor?.district || "",
                isAvailable: cachedPayload.donor?.isAvailable ?? true,
              },
            }
          : {
              patient: {
                contactNumber:
                  cachedPayload.patient?.contactNumber || undefined,
                address: cachedPayload.patient?.address || undefined,
                hospitalName: cachedPayload.patient?.hospitalName || undefined,
              },
            }),
      });
      toast.success("A fresh 6-digit verification code has been sent!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend code";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (step === "OTP") {
    return (
      <div className="w-full max-w-md space-y-6">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="size-6" />
            </div>
            <CardTitle className="font-heading text-2xl font-bold tracking-tight">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-sm">
              We have sent a 6-digit verification code to{" "}
              <span className="font-semibold text-foreground">
                {registeredEmail}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-xs uppercase tracking-wider text-muted-foreground text-center block"
              >
                6-Digit Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="text-center font-mono text-2xl tracking-[0.5em] font-bold h-13"
                autoFocus
              />
              <p className="text-center text-[11px] text-muted-foreground">
                Please check your inbox or spam folder for the code.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full font-semibold"
              size="lg"
              disabled={isVerifying || otp.trim().length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Verifying Account...
                </>
              ) : (
                "Verify & Complete Registration"
              )}
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("REGISTER")}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Edit Information
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t py-4 text-center text-xs text-muted-foreground">
            Already verified?{" "}
            <Link
              href="/login"
              className="ml-1 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-heading text-2xl font-bold tracking-tight">
            Join LifeLink Network
          </CardTitle>
          <CardDescription>
            Register as a voluntary blood donor or create emergency patient
            requests
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-5"
          >
            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Your Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValue("role", "DONOR");
                    clearErrors();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-heading text-sm font-semibold transition-all ${
                    selectedRole === "DONOR"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className="size-4 fill-current" />
                  Voluntary Donor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue("role", "PATIENT");
                    clearErrors();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-heading text-sm font-semibold transition-all ${
                    selectedRole === "PATIENT"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <ShieldCheck className="size-4" />
                  Patient / Requester
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-9"
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                </div>
                {errors.name ? (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Must include uppercase, lowercase, number & symbol
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    disabled={isSubmitting}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Dynamic Donor Fields */}
            {selectedRole === "DONOR" ? (
              <div className="space-y-4 rounded-xl border bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-primary fill-current" />
                  <h3 className="font-heading text-sm font-semibold text-primary">
                    Donor Profile Details
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={selectedBloodGroup}
                      onValueChange={(val) =>
                        setValue("donor.bloodGroup", val as BloodGroup)
                      }
                    >
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {BLOOD_GROUP_LABELS[bg]} ({bg.replace("_", " ")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donorPhone">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="donorPhone"
                        placeholder="+8801700000000"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...register("donor.contactNumber")}
                      />
                    </div>
                    {errors.donor?.contactNumber ? (
                      <p className="text-xs text-destructive">
                        {errors.donor.contactNumber.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="district"
                        placeholder="Dhaka"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...register("donor.district")}
                      />
                    </div>
                    {errors.donor?.district ? (
                      <p className="text-xs text-destructive">
                        {errors.donor.district.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Dhanmondi"
                      disabled={isSubmitting}
                      {...register("donor.city")}
                    />
                    {errors.donor?.city ? (
                      <p className="text-xs text-destructive">
                        {errors.donor.city.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address Details</Label>
                    <Input
                      id="address"
                      placeholder="Road 27, House 12"
                      disabled={isSubmitting}
                      {...register("donor.address")}
                    />
                    {errors.donor?.address ? (
                      <p className="text-xs text-destructive">
                        {errors.donor.address.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isAvailable"
                    defaultChecked
                    onCheckedChange={(checked) =>
                      setValue("donor.isAvailable", checked === true)
                    }
                  />
                  <Label
                    htmlFor="isAvailable"
                    className="text-xs font-medium text-foreground cursor-pointer"
                  >
                    I am healthy and available to donate blood in emergencies
                  </Label>
                </div>
              </div>
            ) : (
              /* Dynamic Patient Fields */
              <div className="space-y-4 rounded-xl border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="font-heading text-sm font-semibold">
                    Optional Patient Profile Details
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">
                      Emergency Contact Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="patientPhone"
                        placeholder="+8801700000000"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...register("patient.contactNumber")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Preferred Hospital</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Dhaka Medical College Hospital"
                      disabled={isSubmitting}
                      {...register("patient.hospitalName")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientAddress">Residential Address</Label>
                  <Input
                    id="patientAddress"
                    placeholder="Area, Street, City"
                    disabled={isSubmitting}
                    {...register("patient.address")}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/login"
            className="ml-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign In Here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
