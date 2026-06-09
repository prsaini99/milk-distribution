import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";

/**
 * Route protection (role-aware):
 *  - /admin/*              → requires an admin session
 *  - /checkout, /account/* → customer-only (role "user")
 *
 * Logged-out visitors go to /login?next=<path>. An admin who lands on a
 * customer-only route is sent to their dashboard (they aren't a customer),
 * and vice-versa — so the two roles never borrow each other's identity.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  const toLogin = () => {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/admin")) {
    if (!session) return toLogin();
    if (session.role !== "admin")
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // Customer-only areas
  if (pathname.startsWith("/checkout") || pathname.startsWith("/account")) {
    if (!session) return toLogin();
    if (session.role !== "user")
      return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/account", "/account/:path*"],
};
