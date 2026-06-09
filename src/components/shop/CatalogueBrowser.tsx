"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import type { Category, Product } from "@/domain";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

/**
 * Storefront catalogue with instant search, category filter and sort
 * (client-side — fast and reload-free for a catalogue of this size).
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
  const [sort, setSort] = useState<Sort>("featured");

  const hasFilters = categoryId !== "all" || query.trim() !== "";
  const clearFilters = () => {
    setQuery("");
    setCategoryId("all");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const inCategory = categoryId === "all" || p.categoryId === categoryId;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return inCategory && matchesQuery;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name")
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, query, categoryId, sort]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Shop our range</h2>
        <span className="text-sm text-muted-foreground">
          {results.length} product{results.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Search + filter + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:min-w-[220px] sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Dropdown
          value={categoryId}
          onChange={setCategoryId}
          className="sm:w-48"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Dropdown>

        <Dropdown
          value={sort}
          onChange={(v) => setSort(v as Sort)}
          className="sm:w-48"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </Dropdown>

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

      {results.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Dropdown({
  value,
  onChange,
  className,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={"relative " + (className ?? "")}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
