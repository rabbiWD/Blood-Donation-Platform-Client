import { api } from "@/lib/api/client";
import type { BloodGroup, IDonorProfile, IUser } from "@/types";

export interface IUpdateUserProfilePayload {
  name?: string;
  contactNumber?: string;
  address?: string;
  hospitalName?: string;
}

export interface IUpdateDonorProfilePayload {
  bloodGroup?: BloodGroup;
  contactNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  isAvailable?: boolean;
  lastDonationDate?: string;
}

export const userService = {
  getMe: async (): Promise<IUser> => {
    const res = await api.get<IUser>("/auth/me");
    return res.data;
  },

  updateProfile: async (payload: IUpdateUserProfilePayload): Promise<IUser> => {
    const res = await api.patch<IUser>("/users/me", payload);
    return res.data;
  },

  updateDonorProfile: async (
    payload: IUpdateDonorProfilePayload,
  ): Promise<IDonorProfile> => {
    const res = await api.patch<IDonorProfile>("/users/donor-profile", payload);
    return res.data;
  },

  uploadProfileImage: async (file: File): Promise<{ profileImage: string }> => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const res = await api.patch<{ profileImage: string }>(
      "/users/profile-image",
      formData,
    );
    return res.data;
  },
};
