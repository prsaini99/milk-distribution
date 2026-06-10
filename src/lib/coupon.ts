import type { Coupon } from "@/domain";
import { formatCurrency } from "./format";

/**
 * Discount amount (paise) a coupon yields on a given subtotal. Returns 0 if the
 * minimum-order threshold isn't met. Single source of truth — used by the cart
 * (display) and the server order service (authoritative).
 */
export function computeDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotal);
}

/** Short human label, e.g. "10% off" or "₹50 off". */
export function describeCoupon(coupon: Coupon): string {
  return coupon.type === "percent"
    ? `${coupon.value}% off`
    : `${formatCurrency(coupon.value)} off`;
}
