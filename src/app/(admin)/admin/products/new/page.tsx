import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listCategories } from "@/server/services/category.service";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await listCategories();

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
        <h1 className="mt-1 text-2xl font-bold">Add product</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
