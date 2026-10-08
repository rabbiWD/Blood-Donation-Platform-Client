"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/lib/api/user.service";
import {
  type UpdateProfileFormData,
  updateProfileSchema,
} from "@/schemas/user.schema";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";

export default function AdminProfilePage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: userService.getMe,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: userProfile?.name || "",
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      userService.updateProfile({
        name: data.name,
      }),
    onSuccess: (updatedUser) => {
      dispatch(setSession(updatedUser));
      queryClient.setQueryData(["auth", "me"], updatedUser);
      toast.success("Administrator profile updated successfully!");
      reset({
        name: updatedUser.name,
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
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

  const onSubmit = (data: UpdateProfileFormData) => {
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
      .toUpperCase() || "AD";

  const currentAvatar = previewImage || userProfile?.profileImage || undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Admin Profile & Security
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your platform administrator credentials and identity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Avatar & Status */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center space-y-5">
          <div className="relative group">
            <Avatar className="h-28 w-28 ring-4 ring-purple-500/10 shadow-md">
              <AvatarImage src={currentAvatar} alt={userProfile?.name} />
              <AvatarFallback className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-2xl">
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

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-border/40 w-full">
            <Badge
              variant="outline"
              className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold"
            >
              Role: {userProfile?.role}
            </Badge>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              Status: {userProfile?.status}
            </Badge>
          </div>

          <div className="w-full pt-4 border-t border-border/40 text-left space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Admin Since
              </span>
              <span className="font-medium text-foreground">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "Platform Launch"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Security Access
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Full Governance
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Profile Form */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Administrator Profile Info
              </h2>
              <p className="text-xs text-muted-foreground">
                Update the display name associated with your administrative
                activity.
              </p>
            </div>

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
                  Admin Email{" "}
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
