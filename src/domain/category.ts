/**
 * A product category in the dairy catalogue (e.g. Milk, Curd, Ghee, Paneer).
 */
export interface Category {
  id: string;
  name: string;
  /** URL-friendly identifier, e.g. "ghee". Used in routes and filters. */
  slug: string;
}
