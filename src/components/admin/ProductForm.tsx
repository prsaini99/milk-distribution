"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product, Unit } from "@/domain";
import { Button, buttonVariants } from "@/components/ui/button";

const UNITS: Unit[] = ["ml", "L", "g", "kg", "piece"];
const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

/**
 * Create/edit form for a product. Talks to the admin product API. Price is
 * entered in rupees and converted to paise on submit.
 */
export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? "",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceRupees, setPriceRupees] = useState(
    product ? String(product.price / 100) : "",
  );
  const [size, setSize] = useState(product ? String(product.size) : "");
  const [unit, setUnit] = useState<Unit>(product?.unit ?? "ml");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [tiers, setTiers] = useState<{ minQty: string; price: string }[]>(
    product?.bulkTiers?.map((t) => ({
      minQty: String(t.minQty),
      price: String(t.price / 100),
    })) ?? [],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTier = () => setTiers((t) => [...t, { minQty: "", price: "" }]);
  const removeTier = (i: number) =>
    setTiers((t) => t.filter((_, idx) => idx !== i));
  const setTier = (i: number, field: "minQty" | "price", value: string) =>
    setTiers((t) =>
      t.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)),
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const bulkTiers = tiers
      .filter((t) => t.minQty !== "" && t.price !== "")
      .map((t) => ({
        minQty: parseInt(t.minQty, 10),
        price: Math.round(parseFloat(t.price) * 100),
      }));

    const payload = {
      name,
      categoryId,
      description,
      imageUrl: imageUrl.trim() || PLACEHOLDER_IMAGE,
      price: Math.round(parseFloat(priceRupees) * 100),
      size: parseFloat(size),
      unit,
      inStock,
      bulkTiers,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="surface-card max-w-2xl space-y-5 p-6"
    >
      <Field label="Product name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Full Cream Milk"
        />
      </Field>

      <Field label="Category">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Short product description"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₹)">
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={priceRupees}
            onChange={(e) => setPriceRupees(e.target.value)}
            className={inputClass}
            placeholder="35.00"
          />
        </Field>
        <Field label="Pack size">
          <input
            required
            type="number"
            min="0"
            step="any"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={inputClass}
            placeholder="500"
          />
        </Field>
        <Field label="Unit">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className={inputClass}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Image URL (optional)">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={inputClass}
          placeholder="/catalogue/your-image.jpg — leave blank for a placeholder"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="size-4 accent-[var(--primary)]"
        />
        <span className="font-medium text-foreground/80">In stock</span>
      </label>

      {/* Wholesale tiers */}
      <div className="space-y-3 rounded-2xl border border-border/60 bg-secondary/35 p-4 shadow-[inset_0_1px_0_color-mix(in_oklch,white_74%,transparent)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground/80">
              Wholesale tiers (optional)
            </p>
            <p className="text-xs text-muted-foreground">
              Lower per-pack price at higher quantities. Appears in the Bulk
              section.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addTier}>
            <Plus className="size-4" /> Add tier
          </Button>
        </div>

        {tiers.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No wholesale tiers — this product is retail-only.
          </p>
        ) : (
          <div className="space-y-2">
            {tiers.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  value={t.minQty}
                  onChange={(e) => setTier(i, "minQty", e.target.value)}
                  placeholder="Min qty"
                  className={inputClass + " w-28"}
                />
                <span className="text-sm text-muted-foreground">packs →</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={t.price}
                  onChange={(e) => setTier(i, "price", e.target.value)}
                  placeholder="₹ / pack"
                  className={inputClass + " w-32"}
                />
                <button
                  type="button"
                  onClick={() => removeTier(i)}
                  aria-label="Remove tier"
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </Button>
        <a
          href="/admin/products"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputClass = "field-control px-3 py-2 text-sm";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </span>
      {children}
    </label>
  );
}
