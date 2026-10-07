import { api } from "@/lib/api/client";
import type { LoginInput } from "@/schemas/auth.schema";
import type { IUser } from "@/types";

export interface ILoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "DONOR" | "PATIENT";
  donor?: {
    bloodGroup: string;
    contactNumber: string;
    address: string;
    city: string;
    district: string;
    isAvailable?: boolean;
  };
  patient?: {
    contactNumber?: string;
    address?: string;
    hospitalName?: string;
  };
}

export const authService = {
  login: async (credentials: LoginInput): Promise<ILoginResponseData> => {
    const res = await api.post<ILoginResponseData>("/auth/login", credentials);
    return res.data;
  },

  register: async (payload: IRegisterPayload): Promise<void> => {
    await api.post<null>("/auth/register", payload);
  },

  getMe: async (): Promise<IUser> => {
    const res = await api.get<IUser>("/auth/me");
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignored if offline or server error
    }
  },
};
