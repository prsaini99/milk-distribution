import type { OrderStatus } from "@/domain";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/order";

/** Pill showing an order's status, colour-coded. */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium " +
        ORDER_STATUS_STYLES[status]
      }
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
