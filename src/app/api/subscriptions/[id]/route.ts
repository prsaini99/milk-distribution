import { NextResponse } from "next/server";
import type { SubscriptionFrequency, SubscriptionStatus } from "@/domain";
import { updateSubscription } from "@/server/services/subscription.service";
import { getCurrentUser, getSession } from "@/server/services/auth.service";

interface Body {
  quantity?: number;
  frequency?: SubscriptionFrequency;
  status?: SubscriptionStatus;
}

/**
 * PATCH /api/subscriptions/:id -> manage a subscription (owner only):
 * change quantity/frequency, pause/resume, or cancel.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "user") {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { id } = await params;

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    const subscription = await updateSubscription(id, user.id, body);
    return NextResponse.json(subscription);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
