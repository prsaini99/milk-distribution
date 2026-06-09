"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

/**
 * Header cart icon with a count bubble at the top-right corner that
 * reflects the number of items in the cart.
 */
export function CartBadge() {
  const { summary } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${summary.count} item${summary.count === 1 ? "" : "s"}`}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-secondary"
    >
      <ShoppingCart className="size-5" />
      {summary.count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground ring-2 ring-background">
          {summary.count}
        </span>
      )}
    </Link>
  );
}
