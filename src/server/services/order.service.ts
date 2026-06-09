import type { Address, Order, OrderItem, OrderStatus } from "@/domain";
import { productRepository, orderRepository } from "@/server/repositories";
import { type CartLine, computeSummary } from "@/lib/cart";
import { unitPriceFor } from "@/lib/pricing";
import { ORDER_STATUS_LABELS } from "@/lib/order";

/** Input accepted from the client at checkout — intentionally minimal. */
export interface CreateOrderInput {
  userId: string;
  customer: { name: string; email: string };
  items: { productId: string; quantity: number }[];
  address: Address;
}

/** Readable order id, e.g. "ORD-3F9A1C2B". */
function generateOrderId(): string {
  return `ORD-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Create an order from a client cart. The server is authoritative: it
 * re-fetches every product, recomputes totals (reusing the same cart math),
 * and snapshots items so the order is immutable. The client's prices/totals
 * are never trusted.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const lines: CartLine[] = [];

  for (const item of input.items) {
    if (item.quantity <= 0) continue;

    const product = await productRepository.findById(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    if (!product.inStock) {
      throw new Error(`${product.name} is out of stock`);
    }

    lines.push({ product, quantity: item.quantity });
  }

  if (lines.length === 0) {
    throw new Error("Cannot place an order with an empty cart");
  }

  const summary = computeSummary(lines);

  const items: OrderItem[] = lines.map((l) => ({
    productId: l.product.id,
    name: l.product.name,
    // Effective price (wholesale tier applied when quantity qualifies).
    price: unitPriceFor(l.product, l.quantity),
    size: l.product.size,
    unit: l.product.unit,
    quantity: l.quantity,
  }));

  const order: Order = {
    id: generateOrderId(),
    userId: input.userId,
    customer: input.customer,
    items,
    subtotal: summary.subtotal,
    deliveryFee: summary.deliveryFee,
    total: summary.total,
    status: "pending",
    address: input.address,
    createdAt: new Date().toISOString(),
  };

  return orderRepository.create(order);
}

/** Fetch a single order by id. */
export async function getOrder(id: string): Promise<Order | null> {
  return orderRepository.findById(id);
}

/** All orders, newest first (used by the admin dashboard). */
export async function listOrders(): Promise<Order[]> {
  return orderRepository.findAll();
}

/** A single customer's orders, newest first (used by the account area). */
export async function listUserOrders(userId: string): Promise<Order[]> {
  return orderRepository.findByUser(userId);
}

/**
 * Update an order's status (admin action). Validates the status value and
 * that the order exists.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  if (!(status in ORDER_STATUS_LABELS)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const updated = await orderRepository.updateStatus(id, status);
  if (!updated) {
    throw new Error(`Order not found: ${id}`);
  }
  return updated;
}

/**
 * Customer-initiated cancellation. Only the order's owner may cancel, and
 * only while it's still `pending` (before the distributor acts on it).
 */
export async function cancelOrder(
  orderId: string,
  userId: string,
): Promise<Order> {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Not your order");
  if (order.status !== "pending") {
    throw new Error("Only pending orders can be cancelled");
  }

  const updated = await orderRepository.updateStatus(orderId, "cancelled");
  if (!updated) throw new Error("Order not found");
  return updated;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number; // paise, excludes cancelled orders
  pendingCount: number;
}

/** Aggregate figures for the admin overview. */
export async function getOrderStats(): Promise<OrderStats> {
  const orders = await orderRepository.findAll();
  return {
    totalOrders: orders.length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
    pendingCount: orders.filter((o) => o.status === "pending").length,
  };
}
