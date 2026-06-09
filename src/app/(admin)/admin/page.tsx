import Link from "next/link";
import { IndianRupee, ClipboardList, Clock, Package } from "lucide-react";
import { getOrderStats, listOrders } from "@/server/services/order.service";
import { listProducts } from "@/server/services/product.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

// Orders live in an in-memory store that changes at runtime — never cache.
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, orders, products] = await Promise.all([
    getOrderStats(),
    listOrders(),
    listProducts(),
  ]);

  const recent = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your store&apos;s activity.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<IndianRupee className="size-5" />}
        />
        <StatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          icon={<ClipboardList className="size-5" />}
        />
        <StatCard
          label="Pending"
          value={String(stats.pendingCount)}
          icon={<Clock className="size-5" />}
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          icon={<Package className="size-5" />}
        />
      </div>

      {/* Recent orders */}
      <section className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-bold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No orders yet. Place one from the storefront to see it here.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">
                      {o.id}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.customer.name} · {formatDateTime(o.createdAt)} ·{" "}
                      {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {formatCurrency(o.total)}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
