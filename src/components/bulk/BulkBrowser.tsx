"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import type { Category, Product } from "@/domain";
import { BulkProductCard } from "./BulkProductCard";

/**
 * Wholesale catalogue with instant search + category dropdown (single row),
 * mirroring the retail CatalogueBrowser.
 */
export function BulkBrowser({
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Business supply
          </p>
          <h2 className="mt-1 text-3xl font-bold">Wholesale catalogue</h2>
        </div>
        <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-sm font-medium text-muted-foreground shadow-xs">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Search + filter — single row */}
      <div className="toolbar-shell flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wholesale products…"
            className="field-control py-2.5 pl-10 pr-3 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="field-control appearance-none py-2.5 pl-4 pr-10 text-sm"
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
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/70 text-muted-foreground shadow-xs transition hover:border-destructive/40 hover:bg-card hover:text-destructive"
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <BulkProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
