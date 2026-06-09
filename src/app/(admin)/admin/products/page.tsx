import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { listProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { formatCurrency, formatPack } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} products in the catalogue
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className={buttonVariants({ className: "gap-1.5" })}
        >
          <Plus className="size-4" /> Add product
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="hidden grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Pack</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-border/60">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 md:grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_auto] md:gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{p.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {categoryName(p.categoryId)}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatPack(p.size, p.unit)}
              </span>
              <span className="font-semibold">{formatCurrency(p.price)}</span>
              <span>
                {p.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    <span className="size-1.5 rounded-full bg-primary" /> In
                    stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-muted-foreground/50" />{" "}
                    Out
                  </span>
                )}
              </span>
              <div className="col-span-2 flex justify-end gap-1 md:col-span-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  aria-label={`Edit ${p.name}`}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteProductButton productId={p.id} productName={p.name} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
