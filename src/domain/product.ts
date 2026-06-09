/**
 * Unit of measure for a dairy product's pack size.
 */
export type Unit = "ml" | "L" | "g" | "kg" | "piece";

/**
 * A wholesale price break: at `minQty` packs or more, each pack costs
 * `price` (paise). Tiers are ordered ascending by minQty.
 */
export interface PriceTier {
  minQty: number;
  price: number; // paise, per pack
}

/**
 * A sellable dairy product — represents a specific pack
 * (e.g. "Full Cream Milk, 500ml" or "Cow Ghee, 1kg").
 */
export interface Product {
  id: string;
  categoryId: string;

  name: string;
  description: string;
  imageUrl: string;

  /**
   * Price for ONE pack, in paise (integer minor units).
   * e.g. ₹30.50 is stored as 3050. Never use floats for money.
   */
  price: number;

  /** Pack size value, paired with `unit`. e.g. size=500, unit="ml". */
  size: number;
  unit: Unit;

  inStock: boolean;

  /**
   * Optional wholesale price breaks for bulk buyers. When present, the
   * product is available in the Bulk/Wholesale section. Ordered ascending
   * by minQty. `price` (retail) always applies below the first tier.
   */
  bulkTiers?: PriceTier[];
}
