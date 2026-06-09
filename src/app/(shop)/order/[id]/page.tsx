import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Truck, MapPin } from "lucide-react";
import { getOrder } from "@/server/services/order.service";
import { formatCurrency, formatPack } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/order";
import { buttonVariants } from "@/components/ui/button";

/**
 * Order confirmation. Server component — reads the order straight from the
 * service (the order is server-side state, not in the client cart).
 */
export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Order placed!</h1>
        <p className="mt-1 text-muted-foreground">
          Thank you. Order{" "}
          <span className="font-mono font-semibold text-foreground">
            {order.id}
          </span>{" "}
          has been received.
        </p>
      </div>

      {/* What's next */}
      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm">
        <Truck className="size-5 shrink-0 text-primary" />
        <span className="text-foreground/80">
          We&apos;ll confirm your order shortly and deliver{" "}
          <span className="font-medium text-foreground">tomorrow morning</span>.
          A confirmation has been sent to your registered contact.
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Order details</h2>
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-medium " +
              ORDER_STATUS_STYLES[order.status]
            }
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="mt-4 divide-y divide-border/60">
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

        <div className="mt-4 space-y-1.5 border-t border-border/60 pt-4 text-sm">
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
          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="size-5 text-primary" /> Delivery address
        </h2>
        <p className="mt-2 text-muted-foreground">
          {order.address.line1}, {order.address.city} — {order.address.pincode}
          <br />
          Phone: {order.address.phone}
        </p>
      </div>

      <div className="text-center">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
