import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const isAuthenticated =
    request.cookies.get("auth-token")?.value === "authenticated";

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/signup", "/"];

  // Check if the path is a dashboard route (starts with /dashboard)
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If user is not authenticated and trying to access dashboard route
  if (!isAuthenticated && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is authenticated and trying to access login page or home
  if (isAuthenticated && (pathname === "/auth/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
