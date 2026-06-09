"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/domain";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/button";

/**
 * Product-detail purchase control: a quantity stepper + add-to-cart.
 * Adds the chosen quantity in one action (unlike the card's single-add).
 */
export function QuantityAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product.inStock) {
    return (
      <Button disabled variant="secondary" className="w-full sm:w-auto">
        Out of stock
      </Button>
    );
  }

  const add = () => {
    addItem(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-border">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex size-10 items-center justify-center rounded-l-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center text-sm font-medium">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="flex size-10 items-center justify-center rounded-r-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <Button onClick={add} size="lg">
        <ShoppingCart className="size-4" /> Add to cart
      </Button>
    </div>
  );
}
