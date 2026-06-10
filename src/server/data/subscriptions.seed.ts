import type { Subscription } from "@/domain";
import { users } from "./users";

/**
 * Seed subscriptions for the demo user so the account section isn't empty.
 * Dates are fixed (relative to the demo "today" of mid-June 2026).
 */
export const seedSubscriptions: Subscription[] = [
  {
    id: "sub_demo01",
    userId: users[0].id,
    productId: "prod_milk_fc_500",
    quantity: 1,
    frequency: "daily",
    status: "active",
    nextDelivery: "2026-06-11T08:00:00.000Z",
    createdAt: "2026-06-05T09:00:00.000Z",
  },
  {
    id: "sub_demo02",
    userId: users[0].id,
    productId: "prod_ghee_cow_500",
    quantity: 1,
    frequency: "weekly",
    status: "active",
    nextDelivery: "2026-06-17T08:00:00.000Z",
    createdAt: "2026-06-04T10:00:00.000Z",
  },
];
