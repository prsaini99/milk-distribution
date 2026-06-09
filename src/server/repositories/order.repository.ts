import type { Order, OrderStatus } from "@/domain";
import { orderStore } from "@/server/data/orders.store";

/**
 * Data-access contract for orders. Mock impl uses the in-memory store; a
 * real DB impl plugs in here without touching the service or UI.
 */
export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByUser(userId: string): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

export class MockOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    orderStore.unshift(order); // newest first
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return orderStore.find((o) => o.id === id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return orderStore;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return orderStore.filter((o) => o.userId === userId);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    const order = orderStore.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  }
}
