import { NextResponse } from "next/server";
import { listCategories } from "@/server/services/category.service";

/** GET /api/categories -> all catalogue categories. */
export async function GET() {
  const categories = await listCategories();
  return NextResponse.json(categories);
}
