"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

/**
 * Header cart link with a live item-count badge.
 */
export function CartBadge() {
  const { summary } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium hover:border-slate-300"
    >
      <span>🛒 Cart</span>
      {summary.count > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs font-semibold text-white">
          {summary.count}
        </span>
      )}
    </Link>
  );
}
