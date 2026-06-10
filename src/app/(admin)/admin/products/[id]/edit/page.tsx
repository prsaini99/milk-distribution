import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    listCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to products
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Catalogue control
        </p>
        <h1 className="mt-1 text-2xl font-bold">Edit product</h1>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  );
}
