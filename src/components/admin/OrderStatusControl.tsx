"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/domain";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/order";

/**
 * Admin control to change an order's status. Clicking a status PATCHes the
 * order and refreshes server data so the badge/overview reflect the change.
 */
export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (status: OrderStatus) => {
    if (status === currentStatus || pending) return;
    setPending(status);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUS_FLOW.map((status) => {
          const active = status === currentStatus;
          const isPending = pending === status;
          return (
            <button
              key={status}
              onClick={() => setStatus(status)}
              disabled={active || pending !== null}
              className={
                "rounded-lg border px-3 py-1.5 text-sm font-medium shadow-xs transition disabled:cursor-not-allowed " +
                (active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-sm disabled:opacity-50")
              }
            >
              {isPending ? "Saving…" : ORDER_STATUS_LABELS[status]}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
