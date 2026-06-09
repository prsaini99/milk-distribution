import { NextResponse } from "next/server";
import { listProducts } from "@/server/services/product.service";

/**
 * GET /api/products            -> all products
 * GET /api/products?category=  -> products in a category (by slug)
 *
 * Thin controller: parse the request, delegate to the service, return JSON.
 * No business logic lives here.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  const products = await listProducts(category);
  return NextResponse.json(products);
}
