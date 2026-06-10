import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/coupons"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to coupons
      </Link>
      <h1 className="text-2xl font-bold">Add coupon</h1>
      <CouponForm />
    </div>
  );
}
