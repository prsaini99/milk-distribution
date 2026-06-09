import Link from "next/link";
import { listProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { ProductCard } from "@/components/shop/ProductCard";

/**
 * Storefront home / catalogue. Server component — calls the service layer
 * directly (the idiomatic Next pattern; no need to fetch our own API).
 * Category filtering is driven by the `?category=<slug>` search param.
 */
export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts(category),
    listCategories(),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Fresh Dairy, Daily</h1>
        <p className="mt-1 text-slate-500">
          Milk, curd, ghee and more — straight from your local distributor.
        </p>
      </section>

      {/* Category filter */}
      <nav className="flex flex-wrap gap-2">
        <FilterPill label="All" href="/" active={!category} />
        {categories.map((c) => (
          <FilterPill
            key={c.id}
            label={c.name}
            href={`/?category=${c.slug}`}
            active={category === c.slug}
          />
        ))}
      </nav>

      {/* Product grid */}
      {products.length === 0 ? (
        <p className="py-12 text-center text-slate-500">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-4 py-1.5 text-sm transition " +
        (active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")
      }
    >
      {label}
    </Link>
  );
}
