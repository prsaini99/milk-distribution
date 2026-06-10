import type { Subscription } from "@/domain";
import { seedSubscriptions } from "./subscriptions.seed";

/**
 * Mutable in-memory subscription store. globalThis-versioned to survive dev
 * hot-reloads; seeded so the demo account has subscriptions on a fresh start.
 * Swap for a DB table later — the repository interface is unchanged.
 */
const globalForSubs = globalThis as unknown as {
  __milkmartSubscriptions_v1?: Subscription[];
};

export const subscriptionStore: Subscription[] =
  globalForSubs.__milkmartSubscriptions_v1 ??
  (globalForSubs.__milkmartSubscriptions_v1 = seedSubscriptions.map((s) => ({
    ...s,
  })));
