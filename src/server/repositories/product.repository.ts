import type { Product } from "@/domain";
import { products } from "@/server/data/products";

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
}

/**
 * In-memory implementation backed by seed data. Async signatures mirror a
 * real DB so callers are already written for the production swap.
 */
export class MockProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return products;
  }

  async findById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) ?? null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return products.filter((p) => p.categoryId === categoryId);
  }
}
