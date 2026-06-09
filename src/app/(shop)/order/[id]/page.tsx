import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/server/services/order.service";
import { formatCurrency, formatPack } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/order";
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
        <p className="text-5xl">✅</p>
        <h1 className="mt-3 text-3xl font-bold">Order placed!</h1>
        <p className="mt-1 text-slate-500">
          Thank you. Your order{" "}
          <span className="font-mono font-medium text-slate-700">
            {order.id}
          </span>{" "}
          has been received.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Order details</h2>
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-medium " +
              ORDER_STATUS_STYLES[order.status]
            }
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="mt-4 divide-y">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between py-3 text-sm"
            >
              <span>
                {item.name}{" "}
                <span className="text-slate-400">
                  ({formatPack(item.size, item.unit)}) × {item.quantity}
                </span>
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Delivery</span>
            <span>
              {order.deliveryFee === 0
                ? "FREE"
                : formatCurrency(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 text-sm">
        <h2 className="text-lg font-semibold">Delivery address</h2>
        <p className="mt-2 text-slate-600">
          {order.address.line1}, {order.address.city} —{" "}
          {order.address.pincode}
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
