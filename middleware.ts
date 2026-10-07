import { type NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  userId?: string;
  name?: string;
  email?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "DONOR" | "PATIENT";
  exp?: number;
}

/**
 * Edge-compatible payload decoder.
 * Extracts the payload claims without requiring Node crypto in the Edge runtime.
 */
function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Base64URL to Base64
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );

    const parsed = JSON.parse(jsonPayload) as DecodedToken;

    // Check expiration if present
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

const ROLE_HOMES: Record<string, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  DONOR: "/donor",
  PATIENT: "/patient",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("accessToken");
  const token = tokenCookie?.value;
  const decoded = token ? decodeJwtPayload(token) : null;
  const role = decoded?.role;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isAdminPath = pathname.startsWith("/admin");
  const isDonorPath = pathname.startsWith("/donor");
  const isPatientPath = pathname.startsWith("/patient");
  const isProtectedPath = isAdminPath || isDonorPath || isPatientPath;

  // 1. If user is already authenticated and visits auth pages, redirect to their panel
  if (isAuthPage && role) {
    const target = ROLE_HOMES[role] || "/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. If visiting protected route without valid token, redirect to /login
  if (isProtectedPath) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Role authorization checks
    if (isAdminPath && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      const correctHome = ROLE_HOMES[role] || "/";
      return NextResponse.redirect(new URL(correctHome, request.url));
    }

    if (isDonorPath && role !== "DONOR") {
      const correctHome = ROLE_HOMES[role] || "/";
      return NextResponse.redirect(new URL(correctHome, request.url));
    }

    if (isPatientPath && role !== "PATIENT") {
      const correctHome = ROLE_HOMES[role] || "/";
      return NextResponse.redirect(new URL(correctHome, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/donor/:path*",
    "/patient/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
