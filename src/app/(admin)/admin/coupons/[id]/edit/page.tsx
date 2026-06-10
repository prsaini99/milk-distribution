import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCoupon } from "@/server/services/coupon.service";
import { CouponForm } from "@/components/admin/CouponForm";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coupon = await getCoupon(id);
  if (!coupon) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/coupons"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to coupons
      </Link>
      <h1 className="text-2xl font-bold">Edit coupon</h1>
      <CouponForm coupon={coupon} />
    </div>
  );
}
