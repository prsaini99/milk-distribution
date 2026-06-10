import type { Subscription } from "@/domain";
import { subscriptionStore } from "@/server/data/subscriptions.store";

export interface SubscriptionRepository {
  create(subscription: Subscription): Promise<Subscription>;
  findById(id: string): Promise<Subscription | null>;
  findByUser(userId: string): Promise<Subscription[]>;
  findAll(): Promise<Subscription[]>;
  update(
    id: string,
    patch: Partial<Subscription>,
  ): Promise<Subscription | null>;
}

export class MockSubscriptionRepository implements SubscriptionRepository {
  async create(subscription: Subscription): Promise<Subscription> {
    subscriptionStore.unshift(subscription);
    return subscription;
  }

  async findById(id: string): Promise<Subscription | null> {
    return subscriptionStore.find((s) => s.id === id) ?? null;
  }

  async findByUser(userId: string): Promise<Subscription[]> {
    return subscriptionStore.filter((s) => s.userId === userId);
  }

  async findAll(): Promise<Subscription[]> {
    return subscriptionStore;
  }

  async update(
    id: string,
    patch: Partial<Subscription>,
  ): Promise<Subscription | null> {
    const sub = subscriptionStore.find((s) => s.id === id);
    if (!sub) return null;
    Object.assign(sub, patch, { id: sub.id });
    return sub;
  }
}
