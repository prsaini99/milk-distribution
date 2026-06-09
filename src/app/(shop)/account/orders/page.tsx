import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/server/services/auth.service";
import { listUserOrders } from "@/server/services/order.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AccountNav } from "@/components/account/AccountNav";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  const orders = await listUserOrders(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <AccountNav />
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-sm">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-5" })}>
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order/${o.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm font-semibold">{o.id}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
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
