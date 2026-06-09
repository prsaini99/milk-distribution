import { NextResponse } from "next/server";
import type { OrderStatus } from "@/domain";
import { getOrder, updateOrderStatus } from "@/server/services/order.service";
import { getSession } from "@/server/services/auth.service";

/** GET /api/orders/:id -> a single order, or 404. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

/**
 * PATCH /api/orders/:id  body: { status }  -> update order status (admin).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: { status?: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  try {
    const order = await updateOrderStatus(id, body.status);
    return NextResponse.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
