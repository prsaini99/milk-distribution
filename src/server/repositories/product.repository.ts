import type { Product } from "@/domain";
import { productStore } from "@/server/data/products.store";

/**
 * Data-access contract for products. The rest of the system depends on THIS
 * interface, never on a concrete data source. To move to a real DB later,
 * write a `PrismaProductRepository implements ProductRepository` and swap the
 * binding in `repositories/index.ts` — no service or UI changes required.
 */
export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * In-memory implementation backed by the mutable product store. Async
 * signatures mirror a real DB so callers are already written for the swap.
 */
export class MockProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return productStore;
  }

  async findById(id: string): Promise<Product | null> {
    return productStore.find((p) => p.id === id) ?? null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return productStore.filter((p) => p.categoryId === categoryId);
  }

  async create(product: Product): Promise<Product> {
    productStore.unshift(product); // newest first in admin lists
    return product;
  }

  async update(id: string, patch: Partial<Product>): Promise<Product | null> {
    const product = productStore.find((p) => p.id === id);
    if (!product) return null;
    Object.assign(product, patch, { id: product.id }); // id is immutable
    return product;
  }

  async delete(id: string): Promise<boolean> {
    const index = productStore.findIndex((p) => p.id === id);
    if (index === -1) return false;
    productStore.splice(index, 1);
    return true;
  }
}
