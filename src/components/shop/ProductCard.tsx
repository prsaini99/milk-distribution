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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={
              "object-cover transition duration-300 group-hover:scale-105 " +
              (product.inStock ? "" : "opacity-60 grayscale")
            }
          />
          {!product.inStock && (
            <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background">
              Out of stock
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5 px-4 pt-3.5 pb-2">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatPack(product.size, product.unit)}
          </p>
          <p className="pt-1 text-lg font-bold text-foreground">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  );
}
