"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatPack } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD, lineTotal, lineUnitPrice } from "@/lib/cart";

export default function CartPage() {
  const { lines, summary, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <ShoppingCart className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-muted-foreground">
          Add some fresh dairy to get started.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Browse products
        </Link>
      </div>
    );
  }

  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - summary.subtotal;
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((summary.subtotal / FREE_DELIVERY_THRESHOLD) * 100),
  );
  const hasOutOfStock = lines.some((l) => !l.product.inStock);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Checkout bag
        </p>
        <h1 className="mt-1 text-3xl font-bold">Your Cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Line items */}
        <div className="space-y-3 lg:col-span-2">
          {lines.map((line) => {
            const { product, quantity } = line;
            const unit = lineUnitPrice(line);
            const isWholesale = unit < product.price;
            return (
            <div
              key={product.id}
              className="surface-card flex gap-4 p-4 transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/60 shadow-[inset_0_1px_0_color-mix(in_oklch,white_80%,transparent)]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-semibold leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPack(product.size, product.unit)} ·{" "}
                      {formatCurrency(unit)} each
                    </p>
                    {isWholesale && product.inStock && (
                      <span className="mt-1 inline-flex rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-foreground/80">
                        Wholesale price applied
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="mt-1 inline-flex rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        Out of stock — remove to continue
                      </span>
                    )}
                  </div>
                  <p className="font-bold">{formatCurrency(lineTotal(line))}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border border-border bg-background/70 shadow-xs">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex size-8 items-center justify-center rounded-l-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex size-8 items-center justify-center rounded-r-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="surface-panel h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order Summary</h2>

          <div className="rounded-xl border border-border/60 bg-secondary/45 p-3">
            <div className="flex justify-between gap-3 text-xs font-medium text-foreground/80">
              <span>
                {remainingForFreeDelivery > 0
                  ? `Add ${formatCurrency(remainingForFreeDelivery)} for free delivery`
                  : "Free delivery unlocked"}
              </span>
              <span>{freeDeliveryProgress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(summary.subtotal)} />
            <Row
              label="Delivery"
              value={
                summary.deliveryFee === 0
                  ? "FREE"
                  : formatCurrency(summary.deliveryFee)
              }
              highlight={summary.deliveryFee === 0}
            />
          </div>

          <div className="flex justify-between border-t border-border/60 pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>

          {hasOutOfStock ? (
            <div className="space-y-2">
              <button
                disabled
                className={buttonVariants({
                  size: "lg",
                  className: "w-full opacity-50",
                })}
              >
                Proceed to Checkout
              </button>
              <p className="text-center text-xs text-destructive">
                Remove out-of-stock items to continue.
              </p>
            </div>
          ) : (
            <Link
              href="/checkout"
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : ""}>
        {value}
      </span>
    </div>
  );
}
