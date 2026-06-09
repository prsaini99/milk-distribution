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
          {/* Table header (desktop) */}
          <div className="hidden grid-cols-[1.4fr_1.6fr_0.8fr_1fr_1.1fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
            <span>Order ID</span>
            <span>Date</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span />
          </div>

          <ul className="divide-y divide-border/60">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="grid grid-cols-2 items-center gap-2 px-5 py-4 transition hover:bg-secondary/50 md:grid-cols-[1.4fr_1.6fr_0.8fr_1fr_1.1fr_auto] md:gap-4"
                >
                  <span className="font-mono text-sm font-medium">{o.id}</span>
                  <span className="text-sm text-muted-foreground md:order-none order-last col-span-2 md:col-span-1">
                    {formatDateTime(o.createdAt)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {o.items.length}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(o.total)}
                  </span>
                  <span>
                    <StatusBadge status={o.status} />
                  </span>
                  <ChevronRight className="hidden size-4 text-muted-foreground md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
