/**
 * A discount coupon. `percent` value is 0–100; `flat` value is paise.
 */
export type CouponType = "percent" | "flat";

export interface Coupon {
  id: string;
  code: string; // stored uppercase
  type: CouponType;
  value: number;
  /** Minimum order subtotal (paise) required; 0 = no minimum. */
  minOrder: number;
  active: boolean;
  description?: string;
}
