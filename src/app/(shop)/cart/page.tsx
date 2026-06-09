"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatPack } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart";

export default function CartPage() {
  const { lines, summary, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-slate-500">Add some fresh dairy to get started.</p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Browse products
        </Link>
      </div>
    );
  }

  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - summary.subtotal;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Line items */}
        <div className="space-y-4 lg:col-span-2">
          {lines.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-xl border bg-white p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50">
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
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-slate-500">
                      {formatPack(product.size, product.unit)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(product.price * quantity)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 text-lg leading-none hover:bg-slate-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 text-lg leading-none hover:bg-slate-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-sm text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit space-y-4 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(summary.subtotal)} />
            <Row
              label="Delivery"
              value={
                summary.deliveryFee === 0
                  ? "FREE"
                  : formatCurrency(summary.deliveryFee)
              }
            />
            {remainingForFreeDelivery > 0 && (
              <p className="text-xs text-slate-500">
                Add {formatCurrency(remainingForFreeDelivery)} more for free
                delivery.
              </p>
            )}
          </div>

          <div className="flex justify-between border-t pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>

          <Link
            href="/checkout"
            className={buttonVariants({ className: "w-full" })}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
