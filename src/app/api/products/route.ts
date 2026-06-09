import { NextResponse } from "next/server";
import {
  listProducts,
  createProduct,
  type ProductInput,
} from "@/server/services/product.service";
import { getSession } from "@/server/services/auth.service";

/**
 * GET /api/products            -> all products
 * GET /api/products?category=  -> products in a category (by slug)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  const products = await listProducts(category);
  return NextResponse.json(products);
}

/**
 * POST /api/products -> create a product (admin only).
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: ProductInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
