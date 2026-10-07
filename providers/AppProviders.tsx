"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api/client";
import { makeStore, type AppStore } from "@/store";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Never retry client errors (4xx) — they won't succeed on retry.
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
