import { NextResponse } from "next/server";
import type { SubscriptionFrequency } from "@/domain";
import { createSubscription } from "@/server/services/subscription.service";
import { getCurrentUser, getSession } from "@/server/services/auth.service";

interface Body {
  productId?: string;
  quantity?: number;
  frequency?: SubscriptionFrequency;
}

/** POST /api/subscriptions -> start a recurring delivery (customers only). */
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "user") {
    return NextResponse.json(
      { error: "Please log in to subscribe" },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.productId || !body.frequency) {
    return NextResponse.json(
      { error: "productId and frequency are required" },
      { status: 400 },
    );
  }

  try {
    const user = await getCurrentUser();
    const subscription = await createSubscription({
      userId: user.id,
      productId: body.productId,
      quantity: body.quantity ?? 1,
      frequency: body.frequency,
    });
    return NextResponse.json(subscription, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to subscribe";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
