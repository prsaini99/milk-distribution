import type { Product } from "@/domain";
import { unitPriceFor } from "./pricing";

/**
 * A cart line as held on the client: a product snapshot plus quantity.
 * (The persisted domain Cart is just id+qty; this enriched shape exists for
 * display and instant total calculation without a server round-trip.)
 */
export interface CartLine {
  product: Product;
  quantity: number;
}

/** Effective per-pack price for a line (applies wholesale tiers). */
export function lineUnitPrice(line: CartLine): number {
  return unitPriceFor(line.product, line.quantity);
}

/** Total price for a line at its effective unit price. */
export function lineTotal(line: CartLine): number {
  return lineUnitPrice(line) * line.quantity;
}

/** Delivery is free above this subtotal (in paise). Below it, a flat fee. */
export const FREE_DELIVERY_THRESHOLD = 49900; // ₹499
export const DELIVERY_FEE = 2500; // ₹25

export interface CartSummary {
  subtotal: number; // paise
  deliveryFee: number; // paise
  total: number; // paise
  count: number; // total quantity across lines
}

/**
 * Pure cart math. Single source of truth for totals — reused by the client
 * and (later) the server's order service so the two can never disagree.
 */
export function computeSummary(lines: CartLine[]): CartSummary {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const count = lines.reduce((n, line) => n + line.quantity, 0);
  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  return { subtotal, deliveryFee, total: subtotal + deliveryFee, count };
}
