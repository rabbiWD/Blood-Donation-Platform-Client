"use client";

import { Loader2 } from "lucide-react";
import Script from "next/script";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
            },
          ) => void;
        };
      };
    };
  }
}

// GSI must be initialized only once per page load; track it at module level.
let gsiInitializedFor: string | null = null;
let gsiCredentialHandler: ((response: { credential?: string }) => void) | null =
  null;

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface GoogleLoginButtonProps {
  disabled?: boolean;
}

export function GoogleLoginButton({ disabled }: GoogleLoginButtonProps) {
  const { googleLogin } = useAuth();
  const { resolvedTheme } = useTheme();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) {
        toast.error("Google credential token not received");
        return;
      }

      setIsSigningIn(true);
      try {
        await googleLogin({ idToken: response.credential });
      } catch {
        // useAuth handles error toasts
      } finally {
        setIsSigningIn(false);
      }
    },
    [googleLogin],
  );

  const renderGoogleButton = useCallback(() => {
    if (
      !window.google?.accounts?.id ||
      !googleBtnContainerRef.current ||
      !clientId
    ) {
      return;
    }

    try {
      // Always point the shared callback at the latest handler
      gsiCredentialHandler = handleCredentialResponse;

      if (gsiInitializedFor !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => gsiCredentialHandler?.(response),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        gsiInitializedFor = clientId;
      }

      // Clear any prior children before re-rendering
      googleBtnContainerRef.current.innerHTML = "";

      const buttonTheme = resolvedTheme === "dark" ? "filled_black" : "outline";

      window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
        type: "standard",
        theme: buttonTheme,
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 380,
      });
    } catch (err) {
      console.error("Failed to render Google Sign-In button:", err);
    }
  }, [clientId, handleCredentialResponse, resolvedTheme]);

  // Check if GSI is already present on client mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      setIsScriptLoaded(true);
    }
  }, []);

  // Re-render button when script is ready or theme switches
  useEffect(() => {
    if (isScriptLoaded) {
      renderGoogleButton();
    }
  }, [isScriptLoaded, renderGoogleButton]);

  return (
    <div className="w-full space-y-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="relative flex min-h-[44px] w-full items-center justify-center">
        {/* Container where Google GSI injects the official button */}
        <div
          ref={googleBtnContainerRef}
          className={`flex w-full justify-center ${disabled || isSigningIn ? "pointer-events-none opacity-50" : ""}`}
        />

        {/* Fallback skeleton button while GSI script is loading */}
        {!isScriptLoaded && (
          <div className="flex h-11 w-full max-w-[380px] items-center justify-center gap-2.5 rounded-lg border border-input bg-background px-4 text-xs font-semibold text-muted-foreground shadow-sm">
            <GoogleIcon className="size-4" />
            <span>Loading Google Sign In...</span>
          </div>
        )}

        {/* Processing Spinner Overlay */}
        {isSigningIn && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying Google account...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
