/**
 * Composition root for the data layer. This is the ONLY place that knows
 * which concrete repository implementation is in use. Swapping the demo's
 * in-memory store for a real database is a change to this file alone.
 */
import {
  type ProductRepository,
  MockProductRepository,
} from "./product.repository";
import {
  type CategoryRepository,
  MockCategoryRepository,
} from "./category.repository";

export const productRepository: ProductRepository = new MockProductRepository();
export const categoryRepository: CategoryRepository =
  new MockCategoryRepository();
