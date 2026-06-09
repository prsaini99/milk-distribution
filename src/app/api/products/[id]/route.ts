import { NextResponse } from "next/server";
import { getProduct } from "@/server/services/product.service";

/**
 * GET /api/products/:id -> a single product, or 404 if not found.
 */
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
