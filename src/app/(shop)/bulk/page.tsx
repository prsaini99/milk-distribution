import Image from "next/image";
import { Boxes, TrendingDown, FileText, CalendarClock } from "lucide-react";
import { listBulkProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { BulkBrowser } from "@/components/bulk/BulkBrowser";

/**
 * Bulk / Wholesale storefront for businesses (shops, cafés, hotels).
 * Reuses the shared cart + checkout — pricing is resolved per quantity.
 */
export default async function BulkPage() {
  const [products, allCategories] = await Promise.all([
    listBulkProducts(),
    listCategories(),
  ]);
  // Only offer categories that actually have wholesale products.
  const categories = allCategories.filter((c) =>
    products.some((p) => p.categoryId === c.id),
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="surface-panel relative isolate overflow-hidden bg-foreground px-6 py-10 text-white sm:px-10 sm:py-12">
        <Image
          src="/catalogue/table-butter.jpg"
          alt="Bulk dairy products packed for business supply"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/92 via-foreground/68 to-foreground/22" />

        <p className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/14 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
          <Boxes className="size-3.5" /> Wholesale &amp; Bulk
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] sm:text-5xl">
          Stock up for your business at wholesale rates.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/78">
          For kirana stores, cafés, restaurants and hotels — the more you
          order, the more you save. Same-day dispatch, every day.
        </p>

        <div className="mt-8 grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-3">
          <Benefit
            icon={<TrendingDown className="size-4 text-gold" />}
            title="Tiered pricing"
            text="Unit price drops as quantity grows."
          />
          <Benefit
            icon={<FileText className="size-4 text-gold" />}
            title="GST invoicing"
            text="Proper tax invoices for your business."
          />
          <Benefit
            icon={<CalendarClock className="size-4 text-gold" />}
            title="Scheduled delivery"
            text="Reliable daily or weekly supply."
          />
        </div>
      </section>

      {/* Bulk catalogue */}
      <section>
        <BulkBrowser products={products} categories={categories} />
      </section>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-l border-white/25 pl-4">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-white/68">{text}</p>
    </div>
  );
}
