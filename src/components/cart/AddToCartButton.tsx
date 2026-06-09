"use client";

import { useState } from "react";
import type { Product } from "@/domain";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/button";

/**
 * Adds a product to the cart. Disabled when out of stock. Shows brief
 * "Added ✓" feedback so the demo feels responsive.
 */
export function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button disabled variant="secondary" className={className}>
        Out of stock
      </Button>
    );
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Button onClick={handleAdd} className={className}>
      {added ? "Added ✓" : "Add to Cart"}
    </Button>
  );
}
