import { NextResponse } from "next/server";
import {
  updateCoupon,
  deleteCoupon,
  type CouponInput,
} from "@/server/services/coupon.service";
import { getSession } from "@/server/services/auth.service";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

/** PATCH /api/coupons/:id -> update a coupon (admin only). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  let body: CouponInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const coupon = await updateCoupon(id, body);
    return NextResponse.json(coupon);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

/** DELETE /api/coupons/:id -> remove a coupon (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  try {
    await deleteCoupon(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
