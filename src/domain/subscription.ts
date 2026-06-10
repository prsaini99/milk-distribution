/**
 * A recurring delivery a customer signs up for (e.g. 1L milk daily).
 */
export type SubscriptionFrequency = "daily" | "weekly";

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  /** ISO date of the next scheduled delivery. */
  nextDelivery: string;
  createdAt: string; // ISO 8601
}
