import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { listCoupons } from "@/server/services/coupon.service";
import { formatCurrency } from "@/lib/format";
import { describeCoupon } from "@/lib/coupon";
import { buttonVariants } from "@/components/ui/button";
import { DeleteCouponButton } from "@/components/admin/DeleteCouponButton";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await listCoupons();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            {coupons.length} coupon{coupons.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className={buttonVariants({ className: "gap-1.5" })}
        >
          <Plus className="size-4" /> Add coupon
        </Link>
      </header>

      {coupons.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No coupons yet. Create one to start offering discounts.
        </div>
      ) : (
        <div className="surface-card overflow-hidden p-0">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
            <span>Code</span>
            <span>Discount</span>
            <span>Min order</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <ul className="divide-y divide-border/60">
            {coupons.map((c) => (
              <li
                key={c.id}
                className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto] md:gap-4"
              >
                <div>
                  <p className="font-mono font-semibold">{c.code}</p>
                  {c.description && (
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium">
                  {describeCoupon(c)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {c.minOrder > 0 ? formatCurrency(c.minOrder) : "—"}
                </span>
                <span>
                  {c.active ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      <span className="size-1.5 rounded-full bg-primary" />{" "}
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-muted-foreground/50" />{" "}
                      Inactive
                    </span>
                  )}
                </span>
                <div className="col-span-2 flex justify-end gap-1 md:col-span-1">
                  <Link
                    href={`/admin/coupons/${c.id}/edit`}
                    aria-label={`Edit ${c.code}`}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteCouponButton couponId={c.id} code={c.code} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
