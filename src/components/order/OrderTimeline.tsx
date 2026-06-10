import { Fragment } from "react";
import { Clock, BadgeCheck, Truck, PackageCheck, XCircle } from "lucide-react";
import type { OrderStatus } from "@/domain";

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "pending", label: "Pending", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: BadgeCheck },
  { status: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: PackageCheck },
];

/** Visual progress tracker for an order's lifecycle. */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="surface-card border-destructive/20 bg-destructive/5 p-5">
        <div className="flex items-center gap-3">
          <XCircle className="size-6 text-destructive" />
          <div>
            <p className="font-bold">Order cancelled</p>
            <p className="text-sm text-muted-foreground">
              This order was cancelled and won&apos;t be delivered.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="surface-card p-5">
      <h2 className="mb-4 font-bold">Order status</h2>
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const Icon = step.icon;
          return (
            <Fragment key={step.status}>
              {i > 0 && (
                <div
                  className={
                    "mt-[18px] h-0.5 flex-1 self-start " +
                    (i <= currentIndex ? "bg-primary" : "bg-border")
                  }
                />
              )}
              <div className="flex w-20 flex-col items-center gap-1.5 text-center">
                <span
                  className={
                    "flex size-9 items-center justify-center rounded-full transition " +
                    (done
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground")
                  }
                >
                  <Icon className="size-4" />
                </span>
                <span
                  className={
                    "text-xs leading-tight " +
                    (done
                      ? "font-medium text-foreground"
                      : "text-muted-foreground")
                  }
                >
                  {step.label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
