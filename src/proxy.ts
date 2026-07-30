import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/shared/lib/supabase/proxy";

// routes only accessible when logged out
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

// routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/products",
  "/orders",
  "/customers",
  "/transactions",
  "/sales",
  "/operations",
  "/inventory",
  "/staff",
  "/settings",
];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route));
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));

  // unauthenticated user trying to access a protected route
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // authenticated user trying to access auth pages — send them to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
