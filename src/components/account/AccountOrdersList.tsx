"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import type { Order, OrderStatus } from "@/domain";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/order";
import { StatusBadge } from "@/components/StatusBadge";

/** A customer's order history with instant search + status filter. */
export function AccountOrdersList({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const hasFilters = status !== "all" || query.trim() !== "";
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = status === "all" || o.status === status;
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="toolbar-shell flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order id or product…"
            className="field-control py-2.5 pl-10 pr-3 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | OrderStatus)}
              className="field-control appearance-none py-2.5 pl-4 pr-10 text-sm"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              aria-label="Clear filters"
              title="Clear filters"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/70 text-muted-foreground shadow-xs transition hover:border-destructive/40 hover:bg-card hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No orders match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`/order/${o.id}`}
              className="surface-card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm font-semibold">{o.id}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {formatDateTime(o.createdAt)} · {o.items.length} item
                  {o.items.length === 1 ? "" : "s"} ·{" "}
                  {o.items
                    .slice(0, 2)
                    .map((i) => i.name)
                    .join(", ")}
                  {o.items.length > 2 ? "…" : ""}
                </p>
              </div>
              <span className="font-bold">{formatCurrency(o.total)}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
