import type { User } from "@/domain";
import { userRepository } from "@/server/repositories";

/**
 * Mock auth for the demo. In production this reads the session/JWT; here it
 * simply returns the seeded demo user. Keeping it behind a service means the
 * rest of the app already calls `getCurrentUser()` and won't change when real
 * auth lands.
 */
export async function getCurrentUser(): Promise<User> {
  return userRepository.findDemoUser();
}
