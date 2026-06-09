import { NextResponse } from "next/server";
import { authenticate } from "@/server/services/auth.service";
import { SESSION_COOKIE, encodeSession, defaultRedirectFor } from "@/lib/auth";

/**
 * POST /api/auth/login  body: { email, password }
 * Validates against the env-configured accounts and sets a session cookie.
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const session = authenticate(body.email ?? "", body.password ?? "");
  if (!session) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({
    role: session.role,
    redirect: defaultRedirectFor(session.role),
  });

  res.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return res;
}
