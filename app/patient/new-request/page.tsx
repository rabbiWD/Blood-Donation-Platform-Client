"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  Loader2,
  ShieldAlert,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bloodRequestService } from "@/lib/api/bloodRequest.service";
import {
  type CreateBloodRequestFormData,
  createBloodRequestSchema,
} from "@/schemas/bloodRequest.schema";
import { BLOOD_GROUPS, type BloodGroup, type UrgencyLevel } from "@/types";

const STEPS = [
  { id: 1, name: "Patient Info", icon: User, desc: "Recipient & Group" },
  {
    id: 2,
    name: "Hospital & Location",
    icon: Building2,
    desc: "Where blood is needed",
  },
  {
    id: 3,
    name: "Urgency & Schedule",
    icon: CalendarClock,
    desc: "Timeline & Severity",
  },
  {
    id: 4,
    name: "Review & Broadcast",
    icon: CheckCircle2,
    desc: "Verify & Dispatch",
  },
];

const POPULAR_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Bogura",
];

export default function NewBloodRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateBloodRequestFormData>({
    resolver: zodResolver(createBloodRequestSchema),
    mode: "onTouched",
    defaultValues: {
      patientName: "",
      bloodGroup: "O_POSITIVE",
      unitsNeeded: 1,
      hospitalName: "",
      hospitalAddress: "",
      city: "Dhaka",
      district: "Dhaka",
      urgency: "STANDARD",
      neededBy: "",
      additionalNotes: "",
    },
  });

  const selectedBloodGroup = watch("bloodGroup");
  const selectedUrgency = watch("urgency");
  const formValues = watch();

  const createMutation = useMutation({
    mutationFn: (data: CreateBloodRequestFormData) =>
      bloodRequestService.create({
        patientName: data.patientName,
        bloodGroup: data.bloodGroup,
        unitsNeeded: Number(data.unitsNeeded),
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        city: data.city,
        district: data.district,
        urgency: data.urgency,
        neededBy: new Date(data.neededBy).toISOString(),
        additionalNotes: data.additionalNotes || undefined,
      }),
    onSuccess: () => {
      toast.success("Emergency blood request broadcasted successfully!", {
        description: "Nearby compatible donors have been alerted.",
      });
      queryClient.invalidateQueries({ queryKey: ["patient", "my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
      router.push("/patient");
    },
    onError: (err: unknown) => {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create request";
      toast.error(errorMsg);
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof CreateBloodRequestFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["patientName", "bloodGroup", "unitsNeeded"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "hospitalName",
        "hospitalAddress",
        "city",
        "district",
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = ["urgency", "neededBy", "additionalNotes"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: CreateBloodRequestFormData) => {
    createMutation.mutate(data);
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/patient")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Create Emergency Blood Request
            </h1>
            <p className="text-sm text-muted-foreground">
              Provide clinical requirements to instantly alert compatible
              donors.
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="bg-card border border-border/60 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5 text-primary"
                    : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                      : "border-border/40 bg-muted/20 text-muted-foreground"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-tight">
                    {step.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Progress value={progressPercentage} className="h-1.5" />
      </div>

      {/* Wizard Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* STEP 1: Patient Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-border/40 pb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Step 1: Patient Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Provide patient identifier and required blood group.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName">
                  Patient Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="patientName"
                  placeholder="e.g. Mohammad Rafiqul Islam"
                  {...register("patientName")}
                />
                {errors.patientName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.patientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>
                  Required Blood Group{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BLOOD_GROUPS.map((group) => {
                    const isSelected = selectedBloodGroup === group;
                    return (
                      <button
                        type="button"
                        key={group}
                        onClick={() =>
                          setValue("bloodGroup", group as BloodGroup)
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                            : "border-border/60 hover:border-primary/40 bg-card"
                        }`}
                      >
                        <BloodGroupBadge group={group} size="md" />
                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.bloodGroup && (
                  <p className="text-xs text-destructive">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitsNeeded">
                  Bags / Units Needed{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="unitsNeeded"
                    type="number"
                    min={1}
                    max={10}
                    className="max-w-[120px]"
                    {...register("unitsNeeded", { valueAsNumber: true })}
                  />
                  <span className="text-xs text-muted-foreground">
                    Units (450ml per bag). Typically 1-2 units per transfusion.
                  </span>
                </div>
                {errors.unitsNeeded && (
                  <p className="text-xs text-destructive">
                    {errors.unitsNeeded.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Hospital & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-border/40 pb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Step 2: Hospital & Location
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ensure the address is clear so donors can calculate distance
                  accurately.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalName">
                  Hospital / Clinical Facility{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hospitalName"
                  placeholder="e.g. Dhaka Medical College Hospital (DMCH)"
                  {...register("hospitalName")}
                />
                {errors.hospitalName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.hospitalName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalAddress">
                  Ward / Cabin / Exact Address{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hospitalAddress"
                  placeholder="e.g. New Building, Ward 4, Bed 12, Secretariate Road"
                  {...register("hospitalAddress")}
                />
                {errors.hospitalAddress && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.hospitalAddress.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">
                    District <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formValues.district}
                    onValueChange={(val) => {
                      setValue("district", val);
                      setValue("city", val);
                    }}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_DISTRICTS.map((dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && (
                    <p className="text-xs text-destructive">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    City / Thana <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Ramna, Dhanmondi, Agrabad"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Urgency & Scheduling */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-border/40 pb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Step 3: Urgency & Timing
                </h2>
                <p className="text-xs text-muted-foreground">
                  Indicate urgency level and transfusion deadline.
                </p>
              </div>

              <div className="space-y-3">
                <Label>
                  Urgency Level <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["CRITICAL", "HIGH", "STANDARD"] as UrgencyLevel[]).map(
                    (urg) => {
                      const isSelected = selectedUrgency === urg;
                      return (
                        <button
                          type="button"
                          key={urg}
                          onClick={() => setValue("urgency", urg)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border/60 hover:border-primary/40 bg-card"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <UrgencyBadge urgency={urg} />
                            {isSelected && (
                              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {urg === "CRITICAL"
                              ? "Life-threatening emergency (within 2-6 hrs)"
                              : urg === "HIGH"
                                ? "Scheduled operation (within 24 hrs)"
                                : "Routine surgery / transfusion (48+ hrs)"}
                          </p>
                        </button>
                      );
                    },
                  )}
                </div>
                {errors.urgency && (
                  <p className="text-xs text-destructive">
                    {errors.urgency.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="neededBy">
                  Required By (Date & Time){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="neededBy"
                  type="datetime-local"
                  {...register("neededBy")}
                />
                {errors.neededBy && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.neededBy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">
                  Clinical Notes / Special Requirements (Optional)
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="e.g. Patient undergoing open-heart bypass surgery. Donor should be non-smoker, preferably previous whole-blood donor."
                  rows={3}
                  {...register("additionalNotes")}
                />
                {errors.additionalNotes && (
                  <p className="text-xs text-destructive">
                    {errors.additionalNotes.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-border/40 pb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Step 4: Review & Confirm Request
                </h2>
                <p className="text-xs text-muted-foreground">
                  Double check the information before broadcasting to verified
                  donors.
                </p>
              </div>

              <div className="bg-muted/40 border border-border/60 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Patient Name
                    </span>
                    <span className="font-semibold text-foreground">
                      {formValues.patientName || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Blood Group & Units
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <BloodGroupBadge
                        group={formValues.bloodGroup}
                        size="sm"
                      />
                      <span className="font-medium text-foreground">
                        ({formValues.unitsNeeded}{" "}
                        {formValues.unitsNeeded > 1 ? "Units" : "Unit"})
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Hospital Facility
                    </span>
                    <span className="font-medium text-foreground">
                      {formValues.hospitalName || "—"}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {formValues.hospitalAddress}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      City / District
                    </span>
                    <span className="font-medium text-foreground">
                      {formValues.city}, {formValues.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Urgency Level
                    </span>
                    <div className="mt-0.5">
                      <UrgencyBadge urgency={formValues.urgency} />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Required By
                    </span>
                    <span className="font-medium text-foreground">
                      {formValues.neededBy
                        ? new Date(formValues.neededBy).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                </div>

                {formValues.additionalNotes && (
                  <div className="pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground block">
                      Clinical Notes
                    </span>
                    <p className="text-xs text-foreground/80 mt-1 italic">
                      "{formValues.additionalNotes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Important Notification</p>
                  <p className="mt-0.5">
                    Submitting this request will make it immediately visible to
                    verified blood donors in{" "}
                    {formValues.district || "your district"}. Please ensure
                    contact availability.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/40">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={createMutation.isPending}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                size="sm"
                onClick={nextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <HeartHandshake className="h-4 w-4 mr-1.5" />
                    Confirm & Broadcast
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
