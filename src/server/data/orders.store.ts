import type { Order } from "@/domain";
import { seedOrders } from "./orders.seed";

/**
 * In-memory order store for the demo. Held on `globalThis` so it survives
 * dev hot-reloads (which can otherwise re-evaluate this module and wipe it).
 * Seeded with a few demo orders so the admin isn't empty on a fresh start.
 * Resets on a full server restart — acceptable for a demo. Swap for a DB
 * table later; the repository interface stays the same.
 */
// Bump the version suffix whenever the Order shape changes, so a dev session's
// hot-reloaded store discards now-incompatible data and re-seeds cleanly.
const globalForOrders = globalThis as unknown as {
  __milkmartOrders_v2?: Order[];
};

export const orderStore: Order[] =
  globalForOrders.__milkmartOrders_v2 ??
  (globalForOrders.__milkmartOrders_v2 = [...seedOrders]);
