"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import type { Category, Product } from "@/domain";
import { ProductCard } from "./ProductCard";

/**
 * Storefront catalogue with instant search + category dropdown (single row).
 * Filters the provided products client-side — fast and reload-free for a
 * catalogue of this size.
 */
export function CatalogueBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  const hasFilters = categoryId !== "all" || query.trim() !== "";
  const clearFilters = () => {
    setQuery("");
    setCategoryId("all");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCategory = categoryId === "all" || p.categoryId === categoryId;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return inCategory && matchesQuery;
    });
  }, [products, query, categoryId]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Shop our range</h2>
        <span className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Search + filter — single row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              aria-label="Clear filters"
              title="Clear filters"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
