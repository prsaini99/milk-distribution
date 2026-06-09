"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Lock, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Address, User } from "@/domain";
import { useCart } from "@/components/cart/CartProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { lineTotal } from "@/lib/cart";

const EMPTY_ADDRESS: Address = { line1: "", city: "", pincode: "", phone: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, summary, clear } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await new Promise((r) => setTimeout(r, 900)); // simulated payment

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

      setPlaced(true);
      clear();
      toast.success(`Order ${data.id} placed successfully 🎉`);
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
        <p className="mt-1 text-muted-foreground">Your cart is empty.</p>
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
        <div className="space-y-4 lg:col-span-2">
          {/* Delivery address */}
          <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="size-5 text-primary" /> Delivery Address
            </h2>
            {user && (
              <p className="mt-1 text-sm text-muted-foreground">
                Delivering to{" "}
                <span className="font-medium text-foreground">{user.name}</span>
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

            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 text-primary" /> Estimated delivery:{" "}
              <span className="font-medium text-foreground">
                tomorrow morning
              </span>
            </p>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CreditCard className="size-5 text-primary" /> Payment
            </h2>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                This is a demo — no real payment is taken. Placing the order
                simulates a successful, secure payment.
              </span>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="h-fit space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order Summary</h2>

          <div className="space-y-2 text-sm">
            {lines.map((line) => (
              <div
                key={line.product.id}
                className="flex justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {line.product.name} × {line.quantity}
                </span>
                <span>{formatCurrency(lineTotal(line))}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border/60 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span
                className={
                  summary.deliveryFee === 0 ? "font-semibold text-primary" : ""
                }
              >
                {summary.deliveryFee === 0
                  ? "FREE"
                  : formatCurrency(summary.deliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border/60 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={placing}
          >
            {placing ? (
              "Processing…"
            ) : (
              <>
                <Lock className="size-4" /> Pay {formatCurrency(summary.total)}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Secured demo checkout
          </p>
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
    <label className={"flex flex-col gap-1.5 text-sm " + (className ?? "")}>
      <span className="font-medium text-foreground/80">{label}</span>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
