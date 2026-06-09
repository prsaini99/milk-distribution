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
      <section className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-secondary to-gold/10 px-6 py-10 sm:px-10 sm:py-12">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm">
          <Boxes className="size-3.5" /> Wholesale &amp; Bulk
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.1] sm:text-5xl">
          Stock up for your business at wholesale rates.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          For kirana stores, cafés, restaurants and hotels — the more you
          order, the more you save. Same-day dispatch, every day.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Benefit
            icon={<TrendingDown className="size-4 text-primary" />}
            title="Tiered pricing"
            text="Unit price drops as quantity grows."
          />
          <Benefit
            icon={<FileText className="size-4 text-primary" />}
            title="GST invoicing"
            text="Proper tax invoices for your business."
          />
          <Benefit
            icon={<CalendarClock className="size-4 text-primary" />}
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
    <div className="rounded-xl border border-border/60 bg-card/70 p-4">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
