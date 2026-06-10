import type { Coupon } from "@/domain";
import { seedCoupons } from "./coupons.seed";

/**
 * Mutable in-memory coupon store. globalThis-versioned to survive dev
 * hot-reloads; seeded so there are working codes on a fresh start.
 */
const globalForCoupons = globalThis as unknown as {
  __milkmartCoupons_v1?: Coupon[];
};

export const couponStore: Coupon[] =
  globalForCoupons.__milkmartCoupons_v1 ??
  (globalForCoupons.__milkmartCoupons_v1 = seedCoupons.map((c) => ({ ...c })));
