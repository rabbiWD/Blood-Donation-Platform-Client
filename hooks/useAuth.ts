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

  useEffect(() => {
    if (!isHydrated) {
      if (!hasToken) {
        dispatch(clearSession());
      } else if (profile) {
        dispatch(setSession(profile));
      } else if (isError) {
        authService.clearTokens();
        dispatch(clearSession());
      }
    }
  }, [profile, isError, hasToken, isHydrated, dispatch]);

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
