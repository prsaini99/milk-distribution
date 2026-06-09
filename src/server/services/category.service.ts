import type { Category } from "@/domain";
import { categoryRepository } from "@/server/repositories";

/** List all catalogue categories (used for storefront nav/filters). */
export async function listCategories(): Promise<Category[]> {
  return categoryRepository.findAll();
}
