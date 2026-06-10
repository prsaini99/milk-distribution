import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Truck, MapPin, ArrowLeft } from "lucide-react";
import { getOrder } from "@/server/services/order.service";
import { getSession, getCurrentUser } from "@/server/services/auth.service";
import { formatCurrency, formatPack, formatDateTime } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { CancelOrderButton } from "@/components/order/CancelOrderButton";
import { ReorderButton } from "@/components/order/ReorderButton";

export const dynamic = "force-dynamic";

/**
 * Order page — doubles as the post-checkout confirmation (`?placed=1`) and the
 * order-detail view from the account. Shows a status timeline and, for the
 * order's owner, cancel (while pending) + reorder actions.
 */
export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const order = await getOrder(id);

  if (!order) notFound();

  const justPlaced = placed === "1";

  const session = await getSession();
  let isOwner = false;
  if (session?.role === "user") {
    const user = await getCurrentUser();
    isOwner = user.id === order.userId;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {justPlaced ? (
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
      ) : (
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to my orders
          </Link>
          <h1 className="mt-3 font-mono text-2xl font-bold">{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
      )}

      {/* Status timeline */}
      <OrderTimeline status={order.status} />

      {justPlaced && order.status !== "cancelled" && (
        <div className="surface-card flex items-center gap-3 border-primary/15 bg-primary/5 p-4 text-sm">
          <Truck className="size-5 shrink-0 text-primary" />
          <span className="text-foreground/80">
            We&apos;ll confirm your order shortly and deliver{" "}
            <span className="font-medium text-foreground">
              tomorrow morning
            </span>
            .
          </span>
        </div>
      )}

      <div className="surface-card p-6">
        <h2 className="text-lg font-bold">Order details</h2>

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
          {(order.discount ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount{order.couponCode ? ` (${order.couponCode})` : ""}
              </span>
              <span className="font-semibold text-primary">
                − {formatCurrency(order.discount ?? 0)}
              </span>
            </div>
          )}
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

      <div className="surface-card p-6 text-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="size-5 text-primary" /> Delivery address
        </h2>
        <p className="mt-2 text-muted-foreground">
          {order.address.line1}, {order.address.city} — {order.address.pincode}
          <br />
          Phone: {order.address.phone}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {isOwner && order.status === "pending" && (
          <CancelOrderButton orderId={order.id} />
        )}
        {isOwner && <ReorderButton items={order.items} />}
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
