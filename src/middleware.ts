import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";

/**
 * Route protection:
 *  - /admin/*   → requires an admin session
 *  - /checkout  → requires any logged-in session
 * Logged-out (or wrong-role) visitors are redirected to /login?next=<path>.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  const needsAdmin = pathname.startsWith("/admin");
  const needsAuth =
    pathname.startsWith("/checkout") || pathname.startsWith("/account");

  const authorized = needsAdmin
    ? session?.role === "admin"
    : needsAuth
      ? session !== null
      : true;

  if (!authorized) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/account", "/account/:path*"],
};
