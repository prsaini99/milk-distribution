import type { Order } from "@/domain";
import { orderStore } from "@/server/data/orders.store";

/**
 * Data-access contract for orders. Mock impl uses the in-memory store; a
 * real DB impl plugs in here without touching the service or UI.
 */
export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
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
}
