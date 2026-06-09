import type { PriceTier, Product, Unit } from "@/domain";
import {
  productRepository,
  categoryRepository,
} from "@/server/repositories";

const UNITS: Unit[] = ["ml", "L", "g", "kg", "piece"];

/** Fields an admin supplies when creating/editing a product. */
export interface ProductInput {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number; // paise
  size: number;
  unit: Unit;
  inStock: boolean;
  bulkTiers?: PriceTier[];
}

/**
 * Validate, sort and de-dupe wholesale tiers. Returns undefined when there
 * are none (so the product simply isn't a bulk product).
 */
function normalizeTiers(
  tiers: PriceTier[] | undefined,
  basePrice: number,
): PriceTier[] | undefined {
  if (!tiers || tiers.length === 0) return undefined;

  for (const t of tiers) {
    if (!Number.isInteger(t.minQty) || t.minQty < 2)
      throw new Error("Tier quantity must be a whole number of 2 or more");
    if (!Number.isFinite(t.price) || t.price <= 0)
      throw new Error("Tier price must be greater than 0");
    if (t.price >= basePrice)
      throw new Error("Each tier price must be below the retail price");
  }

  // De-dupe by minQty (last wins), then sort ascending.
  const byQty = new Map(tiers.map((t) => [t.minQty, t]));
  return [...byQty.values()].sort((a, b) => a.minQty - b.minQty);
}

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

/** Validate admin-supplied product fields. Throws on the first problem. */
async function validateInput(input: ProductInput): Promise<void> {
  if (!input.name.trim()) throw new Error("Name is required");
  if (!UNITS.includes(input.unit)) throw new Error("Invalid unit");
  if (!Number.isFinite(input.price) || input.price <= 0)
    throw new Error("Price must be greater than 0");
  if (!Number.isFinite(input.size) || input.size <= 0)
    throw new Error("Size must be greater than 0");

  const category = await categoryRepository.findAll();
  if (!category.some((c) => c.id === input.categoryId))
    throw new Error("Unknown category");
}

function generateProductId(): string {
  return `prod_${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

/** Create a new product (admin). */
export async function createProduct(input: ProductInput): Promise<Product> {
  await validateInput(input);
  const product: Product = {
    id: generateProductId(),
    ...input,
    name: input.name.trim(),
    bulkTiers: normalizeTiers(input.bulkTiers, input.price),
  };
  return productRepository.create(product);
}

/** Update an existing product (admin), including its wholesale tiers. */
export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  await validateInput(input);
  const updated = await productRepository.update(id, {
    ...input,
    name: input.name.trim(),
    bulkTiers: normalizeTiers(input.bulkTiers, input.price),
  });
  if (!updated) throw new Error("Product not found");
  return updated;
}

/** Delete a product (admin). */
export async function deleteProduct(id: string): Promise<void> {
  const ok = await productRepository.delete(id);
  if (!ok) throw new Error("Product not found");
}
