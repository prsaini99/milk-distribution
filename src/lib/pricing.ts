import type { PriceTier, Product } from "@/domain";

/**
 * The price (paise per pack) for a given quantity of a product. Applies the
 * best wholesale tier the quantity qualifies for; otherwise the retail price.
 *
 * This is the single source of truth for "what does one pack cost right now",
 * used by the cart, checkout, the bulk section and the server order service —
 * so every layer agrees on price.
 */
export function unitPriceFor(product: Product, quantity: number): number {
  let price = product.price;
  for (const tier of product.bulkTiers ?? []) {
    if (quantity >= tier.minQty) price = tier.price;
  }
  return price;
}

/** True if the product offers wholesale pricing. */
export function hasBulkPricing(product: Product): boolean {
  return (product.bulkTiers?.length ?? 0) > 0;
}

/** Smallest quantity that unlocks wholesale pricing, or 1 if none. */
export function minBulkQty(product: Product): number {
  return product.bulkTiers?.[0]?.minQty ?? 1;
}

/**
 * Full price ladder for display: the retail price as the first row, then each
 * wholesale tier. Useful for rendering the "buy more, save more" table.
 */
export function priceLadder(product: Product): PriceTier[] {
  return [{ minQty: 1, price: product.price }, ...(product.bulkTiers ?? [])];
}

/** Maximum discount vs retail across all tiers, as a whole percentage. */
export function maxBulkDiscountPercent(product: Product): number {
  const tiers = product.bulkTiers ?? [];
  if (tiers.length === 0) return 0;
  const lowest = Math.min(...tiers.map((t) => t.price));
  return Math.round((1 - lowest / product.price) * 100);
}

/** Savings (paise) vs buying the same quantity at retail. */
export function bulkSavings(product: Product, quantity: number): number {
  return (product.price - unitPriceFor(product, quantity)) * quantity;
}
