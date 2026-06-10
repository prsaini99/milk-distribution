import { NextResponse } from "next/server";
import { validateCoupon } from "@/server/services/coupon.service";

/**
 * POST /api/coupons/validate  body: { code, subtotal } -> validates a code
 * against the subtotal, returning the coupon + discount (or a 400 with reason).
 */
export async function POST(request: Request) {
  let body: { code?: string; subtotal?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  try {
    const { coupon, discount } = await validateCoupon(
      body.code,
      body.subtotal ?? 0,
    );
    return NextResponse.json({ coupon, discount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid coupon";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
