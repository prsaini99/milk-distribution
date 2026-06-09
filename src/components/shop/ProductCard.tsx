import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/domain";
import { formatCurrency, formatPack } from "@/lib/format";

/**
 * Catalogue tile for a single product. Links to the product detail page.
 * Add-to-cart lands in the Cart module (Step 4).
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-medium leading-tight">{product.name}</h3>
        <p className="text-sm text-slate-500">
          {formatPack(product.size, product.unit)}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold text-slate-900">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
