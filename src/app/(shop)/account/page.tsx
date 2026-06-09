import Link from "next/link";
import { Package, IndianRupee, Clock, MapPin, Mail } from "lucide-react";
import { getCurrentUser } from "@/server/services/auth.service";
import { listUserOrders } from "@/server/services/order.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AccountNav } from "@/components/account/AccountNav";

export const dynamic = "force-dynamic";

const ACTIVE = new Set(["pending", "confirmed", "out_for_delivery"]);

export default async function AccountPage() {
  const user = await getCurrentUser();
  const orders = await listUserOrders(user.id);

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const activeCount = orders.filter((o) => ACTIVE.has(o.status)).length;
  const recent = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user.name}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to your account.
          </p>
        </div>
        <AccountNav />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Orders"
          value={String(orders.length)}
          icon={<Package className="size-5" />}
        />
        <StatCard
          label="Active Orders"
          value={String(activeCount)}
          icon={<Clock className="size-5" />}
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={<IndianRupee className="size-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <section className="rounded-2xl border border-border/70 bg-card shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet.
              <div className="mt-3">
                <Link
                  href="/"
                  className="font-medium text-primary hover:underline"
                >
                  Start shopping →
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/order/${o.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-secondary/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-medium">
                        {o.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)} · {o.items.length} item
                        {o.items.length === 1 ? "" : "s"}
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

        {/* Profile */}
        <section className="h-fit rounded-2xl border border-border/70 bg-card p-5 text-sm shadow-sm">
          <h2 className="font-bold">Profile</h2>
          <p className="mt-3 font-medium">{user.name}</p>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 text-primary" /> {user.email}
          </p>
          <div className="mt-4 border-t border-border/60 pt-4">
            <p className="flex items-center gap-2 font-medium">
              <MapPin className="size-4 text-primary" /> Delivery address
            </p>
            <p className="mt-2 text-muted-foreground">
              {user.address.line1}, {user.address.city} —{" "}
              {user.address.pincode}
              <br />
              Phone: {user.address.phone}
            </p>
          </div>
        </section>
      </div>
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
