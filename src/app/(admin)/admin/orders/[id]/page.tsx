import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { getOrder } from "@/server/services/order.service";
import { formatCurrency, formatPack, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      {/* Status control */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-bold">Update Status</h2>
        <OrderStatusControl orderId={order.id} currentStatus={order.status} />
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Items */}
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm md:col-span-2">
          <h2 className="font-bold">Items</h2>
          <div className="mt-3 divide-y divide-border/60">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between py-3 text-sm"
              >
                <span>
                  {item.name}{" "}
                  <span className="text-muted-foreground">
                    ({formatPack(item.size, item.unit)}) × {item.quantity}
                  </span>
                </span>
                <span className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>
                {order.deliveryFee === 0
                  ? "FREE"
                  : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Customer + Delivery */}
        <div className="h-fit space-y-6">
          <section className="rounded-2xl border border-border/70 bg-card p-5 text-sm shadow-sm">
            <h2 className="flex items-center gap-2 font-bold">
              <User className="size-4 text-primary" /> Customer
            </h2>
            <p className="mt-2 font-medium">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.email}</p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 text-sm shadow-sm">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin className="size-4 text-primary" /> Delivery
            </h2>
            <p className="mt-2 text-muted-foreground">
              {order.address.line1}, {order.address.city} —{" "}
              {order.address.pincode}
              <br />
              Phone: {order.address.phone}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
