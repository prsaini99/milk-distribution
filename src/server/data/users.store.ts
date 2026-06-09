import type { User } from "@/domain";
import { users as seedUsers } from "./users";

/**
 * Mutable in-memory user store (deep-copied from the seed) so profile edits
 * persist within a dev session. Held on globalThis to survive hot-reloads.
 * Swap for a DB table later — the repository interface is unchanged.
 */
const globalForUsers = globalThis as unknown as {
  __milkmartUsers_v1?: User[];
};

export const userStore: User[] =
  globalForUsers.__milkmartUsers_v1 ??
  (globalForUsers.__milkmartUsers_v1 = seedUsers.map((u) => ({
    ...u,
    address: { ...u.address },
  })));
