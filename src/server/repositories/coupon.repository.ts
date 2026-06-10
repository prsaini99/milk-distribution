import type { Coupon } from "@/domain";
import { couponStore } from "@/server/data/coupons.store";

export interface CouponRepository {
  findAll(): Promise<Coupon[]>;
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  create(coupon: Coupon): Promise<Coupon>;
  update(id: string, patch: Partial<Coupon>): Promise<Coupon | null>;
  delete(id: string): Promise<boolean>;
}

export class MockCouponRepository implements CouponRepository {
  async findAll(): Promise<Coupon[]> {
    return couponStore;
  }

  async findById(id: string): Promise<Coupon | null> {
    return couponStore.find((c) => c.id === id) ?? null;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const upper = code.trim().toUpperCase();
    return couponStore.find((c) => c.code === upper) ?? null;
  }

  async create(coupon: Coupon): Promise<Coupon> {
    couponStore.unshift(coupon);
    return coupon;
  }

  async update(id: string, patch: Partial<Coupon>): Promise<Coupon | null> {
    const coupon = couponStore.find((c) => c.id === id);
    if (!coupon) return null;
    Object.assign(coupon, patch, { id: coupon.id });
    return coupon;
  }

  async delete(id: string): Promise<boolean> {
    const index = couponStore.findIndex((c) => c.id === id);
    if (index === -1) return false;
    couponStore.splice(index, 1);
    return true;
  }
}
