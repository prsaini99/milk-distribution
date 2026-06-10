import type { Coupon } from "@/domain";

/** Seed coupons for the demo (prices in paise). */
export const seedCoupons: Coupon[] = [
  {
    id: "cpn_welcome10",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 0,
    active: true,
    description: "10% off your first order",
  },
  {
    id: "cpn_fresh50",
    code: "FRESH50",
    type: "flat",
    value: 5000,
    minOrder: 30000,
    active: true,
    description: "₹50 off orders over ₹300",
  },
  {
    id: "cpn_dairy20",
    code: "DAIRY20",
    type: "percent",
    value: 20,
    minOrder: 50000,
    active: true,
    description: "20% off orders over ₹500",
  },
];
