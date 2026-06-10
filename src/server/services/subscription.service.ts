import type {
  Product,
  Subscription,
  SubscriptionFrequency,
  SubscriptionStatus,
} from "@/domain";
import {
  subscriptionRepository,
  productRepository,
} from "@/server/repositories";

/** A subscription joined with its current product + computed per-delivery cost. */
export interface SubscriptionView extends Subscription {
  product: Product | null;
  perDelivery: number; // paise
}

/** Next delivery = tomorrow (daily) or +7 days (weekly), at 8 AM. */
function computeNextDelivery(frequency: SubscriptionFrequency): string {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  d.setDate(d.getDate() + (frequency === "daily" ? 1 : 7));
  return d.toISOString();
}

function generateId(): string {
  return `sub_${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

export interface CreateSubscriptionInput {
  userId: string;
  productId: string;
  quantity: number;
  frequency: SubscriptionFrequency;
}

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<Subscription> {
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    throw new Error("Quantity must be at least 1");
  }
  const product = await productRepository.findById(input.productId);
  if (!product) throw new Error("Unknown product");
  if (!product.inStock) throw new Error(`${product.name} is out of stock`);

  const subscription: Subscription = {
    id: generateId(),
    userId: input.userId,
    productId: input.productId,
    quantity: input.quantity,
    frequency: input.frequency,
    status: "active",
    nextDelivery: computeNextDelivery(input.frequency),
    createdAt: new Date().toISOString(),
  };
  return subscriptionRepository.create(subscription);
}

/** A user's subscriptions (excluding cancelled), joined with live product data. */
export async function listUserSubscriptions(
  userId: string,
): Promise<SubscriptionView[]> {
  const subs = await subscriptionRepository.findByUser(userId);
  const views: SubscriptionView[] = [];
  for (const s of subs) {
    if (s.status === "cancelled") continue;
    const product = await productRepository.findById(s.productId);
    views.push({
      ...s,
      product,
      perDelivery: product ? product.price * s.quantity : 0,
    });
  }
  return views;
}

export interface UpdateSubscriptionPatch {
  quantity?: number;
  frequency?: SubscriptionFrequency;
  status?: SubscriptionStatus;
}

/** Owner-scoped update (qty/frequency/status). Recomputes next delivery. */
export async function updateSubscription(
  id: string,
  userId: string,
  patch: UpdateSubscriptionPatch,
): Promise<Subscription> {
  const sub = await subscriptionRepository.findById(id);
  if (!sub) throw new Error("Subscription not found");
  if (sub.userId !== userId) throw new Error("Not your subscription");

  const next: Partial<Subscription> = {};

  if (patch.quantity != null) {
    if (patch.quantity <= 0) throw new Error("Quantity must be at least 1");
    next.quantity = patch.quantity;
  }
  if (patch.frequency) {
    next.frequency = patch.frequency;
    next.nextDelivery = computeNextDelivery(patch.frequency);
  }
  if (patch.status) {
    next.status = patch.status;
    if (patch.status === "active") {
      next.nextDelivery = computeNextDelivery(patch.frequency ?? sub.frequency);
    }
  }

  const updated = await subscriptionRepository.update(id, next);
  if (!updated) throw new Error("Subscription not found");
  return updated;
}
