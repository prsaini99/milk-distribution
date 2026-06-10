"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/button";
import { describeCoupon } from "@/lib/coupon";

/** Coupon code entry for the cart — apply/remove a discount. */
export function CouponInput() {
  const { appliedCoupon, applyCoupon, removeCoupon, summary } = useCart();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  if (appliedCoupon) {
    const notMet = summary.discount === 0;
    return (
      <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <Tag className="size-4" /> {appliedCoupon.code} ·{" "}
            {describeCoupon(appliedCoupon)}
          </span>
          <button
            onClick={removeCoupon}
            aria-label="Remove coupon"
            className="text-muted-foreground transition hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
        {notMet && (
          <p className="mt-1 text-xs text-muted-foreground">
            Minimum order not met yet — add more to unlock this discount.
          </p>
        )}
      </div>
    );
  }

  const apply = async () => {
    if (!code.trim()) return;
    setBusy(true);
    const res = await applyCoupon(code.trim());
    setBusy(false);
    if (res.ok) {
      toast.success("Coupon applied!");
      setCode("");
    } else {
      toast.error(res.error ?? "Invalid coupon");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="Coupon code"
        className="field-control py-2 pl-3 pr-3 text-sm uppercase placeholder:normal-case"
      />
      <Button onClick={apply} disabled={busy} variant="outline">
        Apply
      </Button>
    </div>
  );
}
