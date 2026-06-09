import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/server/services/product.service";
import { formatCurrency, formatPack } from "@/lib/format";

/**
 * Product detail page. The "Add to Cart" action is wired up in the Cart
 * module (Step 4) — for now the page presents the product.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-slate-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-slate-500">
              {formatPack(product.size, product.unit)}
            </p>
          </div>

          <p className="text-2xl font-semibold">
            {formatCurrency(product.price)}
          </p>

          <p className="text-slate-600">{product.description}</p>

          <div className="mt-2">
            {product.inStock ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" /> In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> Out of
                stock
              </span>
            )}
          </div>

          {/* Add-to-cart button arrives in Step 4 (Cart module). */}
        </div>
      </div>
    </div>
  );
}
