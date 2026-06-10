import Link from "next/link";
import { getCurrentUser } from "@/server/services/auth.service";
import { listUserOrders } from "@/server/services/order.service";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  const orders = await listUserOrders(user.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Purchase history
        </p>
        <h1 className="mt-1 text-3xl font-bold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-5" })}>
            Browse products
          </Link>
        </div>
      ) : (
        <AccountOrdersList orders={orders} />
      )}
    </div>
  );
}
