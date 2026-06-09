import type { Address } from "./user";
import type { Unit } from "./product";

/**
 * Lifecycle of an order. Linear progression, plus a terminal `cancelled`.
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/**
 * An immutable snapshot of a product at the moment it was ordered.
 * Name/price/unit are COPIED so later catalogue edits never alter
 * historical orders.
 */
export interface OrderItem {
  productId: string;
  name: string;
  /** Price per pack in paise, captured at purchase time. */
  price: number;
  size: number;
  unit: Unit;
  quantity: number;
}

/**
 * A placed order. All money fields are integer paise. The totals are
 * persisted here (not recomputed) precisely because the order is a
 * frozen historical record.
 */
export interface Order {
  id: string;
  userId: string;

  /**
   * Snapshot of who placed the order, captured at order time. Like items and
   * address, this is frozen so the historical record stays accurate even if
   * the customer later changes their profile.
   */
  customer: {
    name: string;
    email: string;
  };

  items: OrderItem[];

  subtotal: number; // paise
  deliveryFee: number; // paise
  total: number; // paise

  status: OrderStatus;
  address: Address;
  createdAt: string; // ISO 8601
}
