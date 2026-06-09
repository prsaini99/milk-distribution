import type { Product } from "@/domain";
import {
  productRepository,
  categoryRepository,
} from "@/server/repositories";

/**
 * Business logic for the catalogue. Controllers (API routes) and server
 * components call these functions; they never touch repositories directly.
 */

/**
 * List products, optionally filtered by category slug. An unknown slug
 * yields an empty list rather than throwing — a filter miss is not an error.
 */
export async function listProducts(categorySlug?: string): Promise<Product[]> {
  if (!categorySlug) {
    return productRepository.findAll();
  }

  const category = await categoryRepository.findBySlug(categorySlug);
  if (!category) return [];

  return productRepository.findByCategory(category.id);
}

/** Fetch a single product by id, or null if it does not exist. */
export async function getProduct(id: string): Promise<Product | null> {
  return productRepository.findById(id);
}

/** Products that offer wholesale pricing (used by the Bulk section). */
export async function listBulkProducts(): Promise<Product[]> {
  const all = await productRepository.findAll();
  return all.filter((p) => (p.bulkTiers?.length ?? 0) > 0);
}
