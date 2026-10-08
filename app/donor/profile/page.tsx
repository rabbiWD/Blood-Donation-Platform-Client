"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Droplet,
  Heart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { userService } from "@/lib/api/user.service";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";
import {
  type UpdateDonorProfileFormData,
  updateDonorProfileSchema,
} from "@/schemas/user.schema";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";

export default function DonorProfilePage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: userService.getMe,
  });

  const donorProfile = userProfile?.donorProfile;

  // Format existing date to YYYY-MM-DD for standard html date input
  const initialDateString = donorProfile?.lastDonationDate
    ? new Date(donorProfile.lastDonationDate).toISOString().split("T")[0]
    : "";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateDonorProfileFormData>({
    resolver: zodResolver(updateDonorProfileSchema),
    values: {
      name: userProfile?.name || "",
      bloodGroup: (donorProfile?.bloodGroup as BloodGroup) || "O_POSITIVE",
      contactNumber: donorProfile?.contactNumber || "",
      address: donorProfile?.address || "",
      city: donorProfile?.city || "",
      district: donorProfile?.district || "",
      isAvailable: donorProfile?.isAvailable ?? true,
      lastDonationDate: initialDateString,
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: UpdateDonorProfileFormData) => {
      // 1. Update user name
      const updatedUser = await userService.updateProfile({
        name: data.name,
      });

      // 2. Update donor profile fields
      const updatedDonor = await userService.updateDonorProfile({
        bloodGroup: data.bloodGroup,
        contactNumber: data.contactNumber,
        address: data.address,
        city: data.city,
        district: data.district,
        isAvailable: data.isAvailable,
        lastDonationDate: data.lastDonationDate || undefined,
      });

      const combinedUser = {
        ...updatedUser,
        donorProfile: updatedDonor,
      };

      return combinedUser;
    },
    onSuccess: (updatedUser) => {
      dispatch(setSession(updatedUser));
      queryClient.setQueryData(["auth", "me"], updatedUser);
      toast.success("Donor profile successfully updated!");
      reset({
        name: updatedUser.name,
        bloodGroup:
          (updatedUser.donorProfile?.bloodGroup as BloodGroup) || "O_POSITIVE",
        contactNumber: updatedUser.donorProfile?.contactNumber || "",
        address: updatedUser.donorProfile?.address || "",
        city: updatedUser.donorProfile?.city || "",
        district: updatedUser.donorProfile?.district || "",
        isAvailable: updatedUser.donorProfile?.isAvailable ?? true,
        lastDonationDate: updatedUser.donorProfile?.lastDonationDate
          ? new Date(updatedUser.donorProfile.lastDonationDate)
              .toISOString()
              .split("T")[0]
          : "",
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update donor profile";
      toast.error(msg);
    },
  });

  // Avatar upload mutation
  const avatarMutation = useMutation({
    mutationFn: (file: File) => userService.uploadProfileImage(file),
    onSuccess: (data) => {
      if (userProfile) {
        const updated = { ...userProfile, profileImage: data.profileImage };
        dispatch(setSession(updated));
        queryClient.setQueryData(["auth", "me"], updated);
      }
      setSelectedFile(null);
      setPreviewImage(null);
      toast.success("Avatar image uploaded successfully!");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to upload profile picture";
      toast.error(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const handleUploadAvatar = () => {
    if (!selectedFile) return;
    avatarMutation.mutate(selectedFile);
  };

  const onSubmit = (data: UpdateDonorProfileFormData) => {
    profileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials =
    userProfile?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DN";

  const currentAvatar = previewImage || userProfile?.profileImage || undefined;

  // Donation eligibility calculation (90 days interval)
  const lastDonation = donorProfile?.lastDonationDate
    ? new Date(donorProfile.lastDonationDate)
    : null;
  const daysSinceDonation = lastDonation
    ? Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isEligibleCooldown =
    daysSinceDonation === null || daysSinceDonation >= 90;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Donor Profile & Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep your blood donation parameters, availability status, and contact
          credentials up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Donor Stat Summary */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center space-y-5">
          <div className="relative group">
            <Avatar className="h-28 w-28 ring-4 ring-primary/10 shadow-md">
              <AvatarImage src={currentAvatar} alt={userProfile?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-transform active:scale-95"
              title="Change photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="w-full space-y-2">
              <p className="text-xs text-muted-foreground truncate">
                Selected: {selectedFile.name}
              </p>
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground"
                onClick={handleUploadAvatar}
                disabled={avatarMutation.isPending}
              >
                {avatarMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Avatar
                  </>
                )}
              </Button>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">
              {userProfile?.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-0.5">
              <Mail className="h-3 w-3" />
              {userProfile?.email}
            </p>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-border/40 w-full">
            <Badge
              variant="outline"
              className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-bold"
            >
              <Droplet className="h-3 w-3 mr-1 fill-current" />
              {donorProfile?.bloodGroup
                ? BLOOD_GROUP_LABELS[donorProfile.bloodGroup]
                : "Not Set"}
            </Badge>

            <Badge
              variant="outline"
              className={
                donorProfile?.isAvailable
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-muted-foreground/30 bg-muted text-muted-foreground"
              }
            >
              {donorProfile?.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {/* Detailed Statistics */}
          <div className="w-full pt-4 border-t border-border/40 text-left space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                Total Donations
              </span>
              <span className="font-semibold text-foreground">
                {donorProfile?.totalDonations || 0} times
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Donation Cooldown
              </span>
              <span
                className={`font-medium ${
                  isEligibleCooldown
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isEligibleCooldown ? "Eligible" : "Cooldown Active"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Account Status
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {userProfile?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Donor Details & Credentials
              </h2>
              <p className="text-xs text-muted-foreground">
                Update your contact information and blood donation parameters.
              </p>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-9"
                    placeholder="Enter your name"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address{" "}
                  <span className="text-xs text-muted-foreground">
                    (Locked)
                  </span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    className="pl-9 bg-muted/50 cursor-not-allowed"
                    value={userProfile?.email || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Blood Group & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">
                  Blood Group <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {BLOOD_GROUP_LABELS[bg]} ({bg.replace("_", " ")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bloodGroup && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">
                  Contact Phone <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactNumber"
                    className="pl-9"
                    placeholder="017XXXXXXXX"
                    {...register("contactNumber")}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* City & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City / Area <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    className="pl-9"
                    placeholder="e.g. Dhanmondi, Mirpur"
                    {...register("city")}
                  />
                </div>
                {errors.city && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">
                  District <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="district"
                    className="pl-9"
                    placeholder="e.g. Dhaka, Chittagong"
                    {...register("district")}
                  />
                </div>
                {errors.district && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            {/* Residential Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Full Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="e.g. House 24, Road 7, Sector 3, Uttara, Dhaka"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Last Donation Date */}
            <div className="space-y-2">
              <Label htmlFor="lastDonationDate">
                Last Donation Date{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional - used for 90-day cooldown calculation)
                </span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastDonationDate"
                  type="date"
                  className="pl-9"
                  {...register("lastDonationDate")}
                />
              </div>
              {errors.lastDonationDate && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.lastDonationDate.message}
                </p>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isAvailable"
                  className="font-semibold text-sm cursor-pointer"
                >
                  Available for Emergency Donation
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, patient requests with matching blood groups will
                  appear in your compatible feed.
                </p>
              </div>

              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isAvailable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
              <Button
                type="submit"
                disabled={profileMutation.isPending || !isDirty}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]"
              >
                {profileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
