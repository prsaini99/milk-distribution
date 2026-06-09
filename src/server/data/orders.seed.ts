import type { Order, OrderItem, OrderStatus } from "@/domain";
import { products } from "./products";
import { users } from "./users";
import { type CartLine, computeSummary } from "@/lib/cart";

/**
 * A few pre-seeded orders so the admin dashboard shows realistic data on a
 * fresh start (instead of an empty state during a demo). Totals are computed
 * the same way the order service computes them, so the numbers are consistent.
 */
function buildOrder(
  id: string,
  status: OrderStatus,
  createdAt: string,
  entries: { productId: string; quantity: number }[],
): Order {
  const lines: CartLine[] = entries.map((e) => ({
    product: products.find((p) => p.id === e.productId)!,
    quantity: e.quantity,
  }));

  const items: OrderItem[] = lines.map((l) => ({
    productId: l.product.id,
    name: l.product.name,
    price: l.product.price,
    size: l.product.size,
    unit: l.product.unit,
    quantity: l.quantity,
  }));

  const summary = computeSummary(lines);

  return {
    id,
    userId: users[0].id,
    customer: { name: users[0].name, email: users[0].email },
    items,
    subtotal: summary.subtotal,
    deliveryFee: summary.deliveryFee,
    total: summary.total,
    status,
    address: users[0].address,
    createdAt,
  };
}

/** Newest first — matches how new orders are inserted. */
export const seedOrders: Order[] = [
  buildOrder("ORD-7C2A9F1B", "pending", "2026-06-09T09:40:00.000Z", [
    { productId: "prod_milk_fc_500", quantity: 2 },
    { productId: "prod_curd_400", quantity: 1 },
  ]),
  buildOrder("ORD-4E8D3A02", "out_for_delivery", "2026-06-09T07:15:00.000Z", [
    { productId: "prod_ghee_cow_500", quantity: 1 },
    { productId: "prod_paneer_200", quantity: 2 },
  ]),
  buildOrder("ORD-1B6F5C77", "delivered", "2026-06-08T18:30:00.000Z", [
    { productId: "prod_milk_toned_1l", quantity: 3 },
    { productId: "prod_butter_100", quantity: 1 },
    { productId: "prod_chaas_500", quantity: 2 },
  ]),
];
