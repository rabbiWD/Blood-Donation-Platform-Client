"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { authService } from "@/lib/api/auth.service";
import { ROLE_HOME } from "@/lib/navigation";
import type { LoginInput } from "@/schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession, setSession } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, role, isAuthenticated, isHydrated } = useAppSelector(
    (state) => state.auth,
  );

  const hasToken = typeof window !== "undefined" && !!authService.getToken();

  // Hydrate session from backend /auth/me on initial app load only if token exists
  const { data: profile, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: !isHydrated && hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 1. Immediately hydrate from cached user on mount if token exists
  useEffect(() => {
    if (!isHydrated) {
      if (hasToken) {
        const cached = authService.getUser();
        if (cached) {
          dispatch(setSession(cached));
        }
      } else {
        dispatch(clearSession());
      }
    }
  }, [hasToken, isHydrated, dispatch]);

  // 2. Synchronize with fresh server profile once /auth/me returns
  useEffect(() => {
    if (profile) {
      authService.setUser(profile);
      dispatch(setSession(profile));
    } else if (isError) {
      authService.clearTokens();
      dispatch(clearSession());
    }
  }, [profile, isError, dispatch]);

  const login = useCallback(
    async (credentials: LoginInput) => {
      try {
        const { user: loggedInUser } = await authService.login(credentials);
        dispatch(setSession(loggedInUser));
        queryClient.setQueryData(["auth", "me"], loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}!`);

        const destination = ROLE_HOME[loggedInUser.role] || "/";
        router.push(destination);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to sign in. Please verify your credentials.";
        toast.error(message);
        throw err;
      }
    },
    [dispatch, queryClient, router],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch(clearSession());
    queryClient.clear();
    toast.info("Logged out successfully");
    router.push("/login");
  }, [dispatch, queryClient, router]);

  return {
    user,
    role,
    isAuthenticated,
    isHydrated,
    login,
    logout,
  };
}
