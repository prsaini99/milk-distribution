import type { User } from "@/domain";

/**
 * Seed users for the demo. Auth is mocked — the "logged-in" user is simply
 * the first entry here (see auth.service). Replaced by real auth post-demo.
 */
export const users: User[] = [
  {
    id: "user_demo",
    name: "Aarav Sharma",
    email: "user@milkmart.in",
    address: {
      line1: "12, Green Park Colony",
      city: "Pune",
      pincode: "411001",
      phone: "9876543210",
    },
  },
];
