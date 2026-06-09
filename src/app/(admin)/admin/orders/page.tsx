import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listOrders } from "@/server/services/order.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"} total
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          No orders yet. Place one from the storefront to see it here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          {/* Header (desktop) */}
          <div className="hidden grid-cols-[1.2fr_1.3fr_1.6fr_0.9fr_1fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span />
          </div>

          <ul className="divide-y divide-border/60">
            {orders.map((o) => {
              const itemSummary = o.items
                .map((i) => `${i.name} ×${i.quantity}`)
                .join(", ");
              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-secondary/50 lg:grid lg:grid-cols-[1.2fr_1.3fr_1.6fr_0.9fr_1fr_auto] lg:items-center lg:gap-4"
                  >
                    {/* Order */}
                    <div>
                      <p className="font-mono text-sm font-semibold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {o.customer.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.customer.email}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground/80">
                        {itemSummary}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.items.length} line
                        {o.items.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    {/* Total */}
                    <span className="font-semibold">
                      {formatCurrency(o.total)}
                    </span>

                    {/* Status */}
                    <span>
                      <StatusBadge status={o.status} />
                    </span>

                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
