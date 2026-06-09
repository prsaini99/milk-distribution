/**
 * Session primitives shared by the server (route handlers, services) and the
 * edge middleware. No Next.js imports here so it is safe in every runtime.
 *
 * NOTE: this is mock auth for a demo — the cookie is base64 JSON, not a signed
 * token. Swap `encodeSession`/`decodeSession` for real signing when auth goes
 * live; nothing else changes.
 */
export const SESSION_COOKIE = "milkmart_session";

export type Role = "admin" | "user";

export interface Session {
  role: Role;
  email: string;
}

export function encodeSession(session: Session): string {
  return btoa(JSON.stringify(session));
}

export function decodeSession(value: string | undefined | null): Session | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(atob(value));
    if (parsed?.role === "admin" || parsed?.role === "user") {
      return { role: parsed.role, email: String(parsed.email ?? "") };
    }
  } catch {
    // malformed cookie — treat as logged out
  }
  return null;
}

/** Where a role lands after login (a `next` target can override for users). */
export function defaultRedirectFor(role: Role): string {
  return role === "admin" ? "/admin" : "/";
}
