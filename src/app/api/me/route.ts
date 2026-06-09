import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/auth.service";

/** GET /api/me -> the current (mock) user, used to prefill checkout. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(user);
}
