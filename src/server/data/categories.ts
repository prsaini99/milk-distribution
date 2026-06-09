import type { Category } from "@/domain";

/**
 * Seed categories for the demo catalogue. In production this moves to a DB
 * table; the shape stays identical so the repository swap is transparent.
 */
export const categories: Category[] = [
  { id: "cat_milk", name: "Milk", slug: "milk" },
  { id: "cat_curd", name: "Curd & Yogurt", slug: "curd" },
  { id: "cat_ghee", name: "Ghee", slug: "ghee" },
  { id: "cat_paneer", name: "Paneer", slug: "paneer" },
  { id: "cat_butter", name: "Butter", slug: "butter" },
  { id: "cat_chaas", name: "Buttermilk", slug: "buttermilk" },
];
