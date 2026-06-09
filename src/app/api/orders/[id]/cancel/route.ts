import { NextResponse } from "next/server";
import { cancelOrder } from "@/server/services/order.service";
import { getCurrentUser, getSession } from "@/server/services/auth.service";

/**
 * POST /api/orders/:id/cancel -> a customer cancels their own pending order.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "user") {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await getCurrentUser();
    const order = await cancelOrder(id, user.id);
    return NextResponse.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cancel failed";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
