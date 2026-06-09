import { cookies } from "next/headers";
import type { Address, User } from "@/domain";
import { userRepository } from "@/server/repositories";
import { type Session, SESSION_COOKIE, decodeSession } from "@/lib/auth";

/**
 * Mock auth for the demo. Credentials live in env vars (server-only) and are
 * checked here. Keeping all of this behind the service means swapping in a
 * real auth provider later is a change to this one file.
 */

/** Validate credentials against the env-configured demo accounts. */
export function authenticate(email: string, password: string): Session | null {
  const e = email.trim().toLowerCase();

  if (
    e === process.env.ADMIN_EMAIL?.toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return { role: "admin", email: e };
  }

  if (
    e === process.env.USER_EMAIL?.toLowerCase() &&
    password === process.env.USER_PASSWORD
  ) {
    return { role: "user", email: e };
  }

  return null;
}

/** The current session from the cookie, or null if logged out. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

/**
 * The current customer for storefront actions (e.g. checkout). Reflects the
 * logged-in email over the seeded demo profile. Falls back to the demo user
 * so non-gated flows still work.
 */
export async function getCurrentUser(): Promise<User> {
  const demo = await userRepository.findDemoUser();
  const session = await getSession();
  return session ? { ...demo, email: session.email } : demo;
}

/** Fields a customer may edit on their profile. Email is the login identity. */
export interface ProfileInput {
  name: string;
  address: Address;
}

/** Update the current user's profile (name + delivery address). */
export async function updateProfile(input: ProfileInput): Promise<User> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  if (!input.name.trim()) throw new Error("Name is required");
  const a = input.address;
  if (!a.line1.trim() || !a.city.trim() || !a.pincode.trim() || !a.phone.trim())
    throw new Error("All address fields are required");

  const demo = await userRepository.findDemoUser();
  const updated = await userRepository.update(demo.id, {
    name: input.name.trim(),
    address: {
      line1: a.line1.trim(),
      city: a.city.trim(),
      pincode: a.pincode.trim(),
      phone: a.phone.trim(),
    },
  });
  if (!updated) throw new Error("User not found");

  return { ...updated, email: session.email };
}
