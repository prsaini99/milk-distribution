import { NextResponse } from "next/server";
import {
  getProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/server/services/product.service";
import { getSession } from "@/server/services/auth.service";

/** GET /api/products/:id -> a single product, or 404 if not found. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

/** PATCH /api/products/:id -> update a product (admin only). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: ProductInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const product = await updateProduct(id, body);
    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

/** DELETE /api/products/:id -> remove a product (admin only). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
