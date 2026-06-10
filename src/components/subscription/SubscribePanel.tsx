"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Repeat, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product, SubscriptionFrequency } from "@/domain";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { FREQUENCY_OPTIONS, FREQUENCY_LABELS } from "@/lib/subscription";

/**
 * "Subscribe & save" panel on the product page — starts a recurring delivery.
 */
export function SubscribePanel({ product }: { product: Product }) {
  const router = useRouter();
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("daily");
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);

  const subscribe = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          frequency,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        toast.error(data.error ?? "Please log in to subscribe");
        router.push(`/login?next=/products/${product.id}`);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to subscribe");
      toast.success("Subscription started! 🥛");
      router.push("/account/subscriptions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe");
      setSaving(false);
    }
  };

  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex items-center gap-2">
        <span className="icon-tile size-9">
          <Repeat className="size-4" />
        </span>
        <div className="leading-none">
          <p className="font-bold">Subscribe &amp; never run out</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Auto-delivered. Pause or cancel anytime.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground/80">Frequency</span>
          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as SubscriptionFrequency)
            }
            className="field-control py-2 pl-3 pr-8 text-sm"
          >
            {FREQUENCY_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {FREQUENCY_LABELS[f]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground/80">Quantity</span>
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-9 items-center justify-center rounded-l-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-9 text-center text-sm font-medium">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex size-9 items-center justify-center rounded-r-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-sm text-muted-foreground">
          {formatCurrency(product.price * qty)} per delivery
        </span>
        <Button onClick={subscribe} disabled={saving}>
          {saving ? "Starting…" : "Subscribe"}
        </Button>
      </div>
    </div>
  );
}
