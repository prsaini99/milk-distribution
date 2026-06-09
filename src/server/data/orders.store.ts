import type { Order } from "@/domain";

/**
 * In-memory order store for the demo. Held on `globalThis` so it survives
 * dev hot-reloads (which can otherwise re-evaluate this module and wipe it).
 * Resets on a full server restart — acceptable for a demo. Swap for a DB
 * table later; the repository interface stays the same.
 */
const globalForOrders = globalThis as unknown as {
  __milkmartOrders?: Order[];
};

export const orderStore: Order[] =
  globalForOrders.__milkmartOrders ?? (globalForOrders.__milkmartOrders = []);
