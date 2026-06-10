import { NextResponse } from "next/server";
import {
  createCoupon,
  type CouponInput,
} from "@/server/services/coupon.service";
import { getSession } from "@/server/services/auth.service";

/** POST /api/coupons -> create a coupon (admin only). */
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: CouponInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
