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

export const setClientCookie = (
  name: string,
  value: string,
  maxAge: number,
) => {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: cookie required for Next.js edge middleware
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const clearClientCookie = (name: string) => {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: cookie required for Next.js edge middleware
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

export const authService = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    setClientCookie("accessToken", accessToken, 86400);
  },

  setUser: (user: IUser): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: (): IUser | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as IUser;
    } catch {
      return null;
    }
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearClientCookie("accessToken");
  },

  login: async (credentials: LoginInput): Promise<ILoginResponseData> => {
    const res = await api.post<ILoginResponseData>("/auth/login", credentials);
    if (res.data?.accessToken) {
      authService.setTokens(res.data.accessToken, res.data.refreshToken);
      if (res.data?.user) {
        authService.setUser(res.data.user);
      }
    }
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
    authService.clearTokens();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignored if offline or server error
    }
  },

  forgotPassword: async (payload: {
    email: string;
  }): Promise<{ message: string }> => {
    const res = await api.post<null>("/auth/forgot-password", payload);
    return { message: res.message || "OTP sent to your email" };
  },

  resetPassword: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const res = await api.post<null>("/auth/reset-password", payload);
    return { message: res.message || "Password reset successful" };
  },
};
