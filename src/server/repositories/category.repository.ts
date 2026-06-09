import type { Category } from "@/domain";
import { categories } from "@/server/data/categories";

/**
 * Data-access contract for categories. See ProductRepository for the swap
 * strategy — identical pattern.
 */
export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
}

export class MockCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return categories;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return categories.find((c) => c.slug === slug) ?? null;
  }
}
