import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/domain";
import { formatCurrency, formatPack } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/**
 * Catalogue tile for a single product. The image + details link to the
 * detail page; the add-to-cart button sits outside the link (no nested
 * interactive elements).
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-md">
      <Link href={`/products/${product.id}`} className="flex flex-col">
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

        <div className="flex flex-col gap-1 p-4 pb-2">
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <p className="text-sm text-slate-500">
            {formatPack(product.size, product.unit)}
          </p>
          <p className="pt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  );
}
