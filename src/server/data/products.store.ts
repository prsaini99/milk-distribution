import type { Product } from "@/domain";
import { products as seedProducts } from "./products";

/**
 * Mutable in-memory product catalogue for the demo. Seeded (deep-copied) from
 * the static seed so admin CRUD doesn't mutate the seed source. Held on
 * globalThis so it survives dev hot-reloads. Swap for a DB table later — the
 * repository interface is unchanged.
 */
const globalForProducts = globalThis as unknown as {
  __milkmartProducts_v1?: Product[];
};

export const productStore: Product[] =
  globalForProducts.__milkmartProducts_v1 ??
  (globalForProducts.__milkmartProducts_v1 = seedProducts.map((p) => ({
    ...p,
    bulkTiers: p.bulkTiers?.map((t) => ({ ...t })),
  })));
