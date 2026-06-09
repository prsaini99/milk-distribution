import { listOrders } from "@/server/services/order.service";
import { AdminOrdersList } from "@/components/admin/AdminOrdersList";

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
        <AdminOrdersList orders={orders} />
      )}
    </div>
  );
}
