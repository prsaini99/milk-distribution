import { NextResponse } from "next/server";
import type { Address } from "@/domain";
import { updateProfile, getSession } from "@/server/services/auth.service";

/** PATCH /api/account/profile -> update the logged-in user's profile. */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  let body: { name?: string; address?: Address };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name || !body.address) {
    return NextResponse.json(
      { error: "name and address are required" },
      { status: 400 },
    );
  }

  try {
    const user = await updateProfile({ name: body.name, address: body.address });
    return NextResponse.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
