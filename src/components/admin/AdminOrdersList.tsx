"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import type { Order, OrderStatus } from "@/domain";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/order";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * Admin orders table with instant search (order id / customer / product) and
 * a status filter dropdown — client-side over the provided orders.
 */
export function AdminOrdersList({ orders }: { orders: Order[] }) {
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
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order id, customer, product…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | OrderStatus)}
              className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {orders.length} order
        {orders.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="hidden grid-cols-[1.2fr_1.3fr_1.6fr_0.9fr_1fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No orders match your filters.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((o) => {
              const itemSummary = o.items
                .map((i) => `${i.name} ×${i.quantity}`)
                .join(", ");
              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-secondary/50 lg:grid lg:grid-cols-[1.2fr_1.3fr_1.6fr_0.9fr_1fr_auto] lg:items-center lg:gap-4"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {o.customer.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.customer.email}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground/80">
                        {itemSummary}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.items.length} line{o.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(o.total)}
                    </span>
                    <span>
                      <StatusBadge status={o.status} />
                    </span>
                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
