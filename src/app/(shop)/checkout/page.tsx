"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Address, User } from "@/domain";
import { useCart } from "@/components/cart/CartProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const EMPTY_ADDRESS: Address = { line1: "", city: "", pincode: "", phone: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, summary, clear } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill address from the (mock) logged-in user.
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((u: User) => {
        setUser(u);
        setAddress(u.address);
      })
      .catch(() => {});
  }, []);

  const setField = (field: keyof Address, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setError(null);

    try {
      // Simulated payment delay for demo realism.
      await new Promise((r) => setTimeout(r, 900));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
          })),
          address,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      setPlaced(true); // prevents the empty-cart flash before redirect
      clear();
      router.push(`/order/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPlacing(false);
    }
  };

  if (lines.length === 0 && !placed) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-1 text-slate-500">Your cart is empty.</p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Delivery details */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            {user && (
              <p className="mt-1 text-sm text-slate-500">
                Delivering to <span className="font-medium">{user.name}</span>
              </p>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Address"
                value={address.line1}
                onChange={(v) => setField("line1", v)}
                className="sm:col-span-2"
              />
              <Field
                label="City"
                value={address.city}
                onChange={(v) => setField("city", v)}
              />
              <Field
                label="Pincode"
                value={address.pincode}
                onChange={(v) => setField("pincode", v)}
              />
              <Field
                label="Phone"
                value={address.phone}
                onChange={(v) => setField("phone", v)}
                className="sm:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-slate-500">
              💳 This is a demo — no real payment is taken. Clicking “Place
              Order” simulates a successful payment.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit space-y-4 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="space-y-2 text-sm">
            {lines.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between">
                <span className="text-slate-500">
                  {product.name} × {quantity}
                </span>
                <span>{formatCurrency(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery</span>
              <span>
                {summary.deliveryFee === 0
                  ? "FREE"
                  : formatCurrency(summary.deliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={placing}>
            {placing
              ? "Processing…"
              : `Pay ${formatCurrency(summary.total)} · Place Order`}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={"flex flex-col gap-1 text-sm " + (className ?? "")}>
      <span className="text-slate-600">{label}</span>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 outline-none focus:border-slate-400"
      />
    </label>
  );
}
