import type { Coupon, CouponType } from "@/domain";
import { couponRepository } from "@/server/repositories";
import { computeDiscount } from "@/lib/coupon";

/** Validate a code against a subtotal. Throws with a clear reason if invalid. */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<{ coupon: Coupon; discount: number }> {
  const coupon = await couponRepository.findByCode(code);
  if (!coupon || !coupon.active) {
    throw new Error("Invalid coupon code");
  }
  if (subtotal < coupon.minOrder) {
    throw new Error(
      `Add more — this coupon needs a minimum order of ₹${coupon.minOrder / 100}`,
    );
  }
  return { coupon, discount: computeDiscount(coupon, subtotal) };
}

// ----- Admin CRUD -----

export interface CouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  active: boolean;
  description?: string;
}

function validateInput(input: CouponInput): void {
  if (!input.code.trim()) throw new Error("Code is required");
  if (input.type !== "percent" && input.type !== "flat")
    throw new Error("Invalid type");
  if (!Number.isFinite(input.value) || input.value <= 0)
    throw new Error("Value must be greater than 0");
  if (input.type === "percent" && input.value > 100)
    throw new Error("Percentage cannot exceed 100");
  if (!Number.isFinite(input.minOrder) || input.minOrder < 0)
    throw new Error("Minimum order can't be negative");
}

export async function listCoupons(): Promise<Coupon[]> {
  return couponRepository.findAll();
}

export async function getCoupon(id: string): Promise<Coupon | null> {
  return couponRepository.findById(id);
}

export async function createCoupon(input: CouponInput): Promise<Coupon> {
  validateInput(input);
  const code = input.code.trim().toUpperCase();
  if (await couponRepository.findByCode(code)) {
    throw new Error("A coupon with that code already exists");
  }
  return couponRepository.create({
    id: `cpn_${globalThis.crypto.randomUUID().slice(0, 8)}`,
    ...input,
    code,
  });
}

export async function updateCoupon(
  id: string,
  input: CouponInput,
): Promise<Coupon> {
  validateInput(input);
  const code = input.code.trim().toUpperCase();
  const existing = await couponRepository.findByCode(code);
  if (existing && existing.id !== id) {
    throw new Error("A coupon with that code already exists");
  }
  const updated = await couponRepository.update(id, { ...input, code });
  if (!updated) throw new Error("Coupon not found");
  return updated;
}

export async function deleteCoupon(id: string): Promise<void> {
  const ok = await couponRepository.delete(id);
  if (!ok) throw new Error("Coupon not found");
}
