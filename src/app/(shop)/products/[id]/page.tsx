import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { getProduct } from "@/server/services/product.service";
import { formatCurrency, formatPack } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/**
 * Product detail page.
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
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/70 bg-secondary/50 shadow-sm">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Out of stock
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-muted-foreground">
              {formatPack(product.size, product.unit)}
            </p>
          </div>

          <p className="text-3xl font-bold">{formatCurrency(product.price)}</p>

          <p className="leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="pt-1">
            <AddToCartButton product={product} className="w-full sm:w-auto" />
          </div>

          {/* Reassurance strip */}
          <div className="mt-2 grid gap-3 border-t border-border/60 pt-5 text-sm sm:grid-cols-2">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4 text-primary" /> Free delivery over ₹499
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Quality tested
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
