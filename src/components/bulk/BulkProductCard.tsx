"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/domain";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPack } from "@/lib/format";
import {
  unitPriceFor,
  minBulkQty,
  priceLadder,
  bulkSavings,
} from "@/lib/pricing";

/**
 * Wholesale product tile: pick a quantity, see the tiered unit price and
 * savings update live, then add to the (shared) cart.
 */
export function BulkProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  // Open at the first wholesale tier (so savings are visible), but allow any
  // quantity down to 1 — the tier resolver handles the price either way.
  const [qty, setQty] = useState(minBulkQty(product));

  const ladder = priceLadder(product);
  const unit = unitPriceFor(product, qty);
  const savings = bulkSavings(product, qty);
  const discount = Math.round((1 - unit / product.price) * 100);

  // Index of the active tier (last ladder row whose minQty <= qty).
  const activeIndex = ladder.reduce(
    (acc, tier, i) => (qty >= tier.minQty ? i : acc),
    0,
  );

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${qty} × ${product.name} added (wholesale)`);
  };

  return (
    <div className="surface-card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
      <div className="flex gap-4 p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-secondary/60 shadow-[inset_0_1px_0_color-mix(in_oklch,white_80%,transparent)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatPack(product.size, product.unit)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Retail {formatCurrency(product.price)}
          </p>
          {!product.inStock && (
            <span className="mt-1.5 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Tier ladder */}
      <div className="border-y border-border/60 bg-secondary/45 px-4 py-3 shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent)]">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Buy more, save more
        </p>
        <div className="space-y-1">
          {ladder.map((tier, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={tier.minQty}
                onClick={() => setQty(tier.minQty)}
                className={
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition " +
                  (active
                    ? "bg-card font-semibold text-primary shadow-xs"
                    : "text-foreground/80 hover:bg-card/70")
                }
              >
                <span>
                  {i === 0 ? "1+" : `${tier.minQty}+`} packs
                </span>
                <span>{formatCurrency(tier.price)} / pack</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity + add */}
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <div className="flex items-center rounded-lg border border-border bg-background/70 shadow-xs">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-8 items-center justify-center rounded-l-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-14 border-x border-border bg-transparent py-1 text-center text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex size-8 items-center justify-center rounded-r-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{formatCurrency(unit * qty)}</p>
          </div>
          {savings > 0 && (
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-foreground/80">
              Save {formatCurrency(savings)} ({discount}%)
            </span>
          )}
        </div>

        {product.inStock ? (
          <Button onClick={handleAdd} className="w-full">
            <Check className="size-4" /> Add {qty} to cart
          </Button>
        ) : (
          <Button disabled variant="secondary" className="w-full">
            Out of stock
          </Button>
        )}
      </div>
    </div>
  );
}
