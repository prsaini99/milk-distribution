/**
 * A line item in the cart — references a live product by id.
 * Pricing/name are NOT copied here; the cart always reflects the
 * current catalogue. Snapshotting happens only at order time.
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/**
 * A user's shopping cart. Totals are computed by the cart service,
 * not stored, so they can never drift out of sync with the items.
 */
export interface Cart {
  id: string;
  items: CartItem[];
}
