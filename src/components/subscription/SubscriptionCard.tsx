"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Pause, Play, CalendarClock, X } from "lucide-react";
import { toast } from "sonner";
import type { SubscriptionFrequency, SubscriptionStatus } from "@/domain";
import { formatCurrency, formatPack, formatDate } from "@/lib/format";
import {
  FREQUENCY_OPTIONS,
  FREQUENCY_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_STYLES,
} from "@/lib/subscription";
import type { SubscriptionView } from "@/server/services/subscription.service";

export function SubscriptionCard({ sub }: { sub: SubscriptionView }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const patch = async (
    body: {
      quantity?: number;
      frequency?: SubscriptionFrequency;
      status?: SubscriptionStatus;
    },
    successMsg = "Subscription updated",
  ) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }
      toast.success(successMsg);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    if (!window.confirm("Cancel this subscription?")) return;
    patch({ status: "cancelled" }, "Subscription cancelled");
  };

  const paused = sub.status === "paused";

  return (
    <div className="surface-card p-4">
      <div className="flex gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/50">
          {sub.product && (
            <Image
              src={sub.product.imageUrl}
              alt={sub.product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-tight">
                {sub.product ? sub.product.name : "Product unavailable"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {sub.quantity} × {FREQUENCY_LABELS[sub.frequency]}
                {sub.product
                  ? ` · ${formatCurrency(sub.perDelivery)}/delivery`
                  : ""}
              </p>
            </div>
            <span
              className={
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
                SUBSCRIPTION_STATUS_STYLES[sub.status]
              }
            >
              {SUBSCRIPTION_STATUS_LABELS[sub.status]}
            </span>
          </div>

          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarClock className="size-4 text-primary" />
            {paused ? (
              "Paused — no upcoming delivery"
            ) : (
              <>
                Next delivery{" "}
                <span className="font-medium text-foreground">
                  {formatDate(sub.nextDelivery)}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Manage */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <div className="flex items-center rounded-lg border border-border">
          <button
            onClick={() => patch({ quantity: sub.quantity - 1 })}
            disabled={busy || sub.quantity <= 1}
            className="flex size-8 items-center justify-center rounded-l-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {sub.quantity}
          </span>
          <button
            onClick={() => patch({ quantity: sub.quantity + 1 })}
            disabled={busy}
            className="flex size-8 items-center justify-center rounded-r-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <select
          value={sub.frequency}
          onChange={(e) =>
            patch({ frequency: e.target.value as SubscriptionFrequency })
          }
          disabled={busy}
          className="field-control w-auto py-1.5 pl-3 pr-7 text-sm"
        >
          {FREQUENCY_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_LABELS[f]}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            patch(
              { status: paused ? "active" : "paused" },
              paused ? "Subscription resumed" : "Subscription paused",
            )
          }
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
        >
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          onClick={cancel}
          disabled={busy}
          className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-destructive disabled:opacity-50"
        >
          <X className="size-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
