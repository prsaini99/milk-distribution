import { NextResponse } from "next/server";
import type { Address } from "@/domain";
import { createOrder } from "@/server/services/order.service";
import { getCurrentUser } from "@/server/services/auth.service";

interface OrderRequestBody {
  items: { productId: string; quantity: number }[];
  address: Address;
}

/**
 * POST /api/orders -> create an order from the client cart.
 * The user is resolved server-side (mock auth); the client never sends it.
 */
export async function POST(request: Request) {
  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || !body.address) {
    return NextResponse.json(
      { error: "items and address are required" },
      { status: 400 },
    );
  }

  try {
    const user = await getCurrentUser();
    const order = await createOrder({
      userId: user.id,
      customer: { name: user.name, email: user.email },
      items: body.items,
      address: body.address,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
