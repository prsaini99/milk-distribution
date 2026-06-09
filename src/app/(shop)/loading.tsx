/**
 * Storefront loading skeleton — shown while a shop route's data resolves.
 * Mirrors the catalogue layout so the transition feels seamless.
 */
export default function ShopLoading() {
  return (
    <div className="space-y-10">
      {/* Hero placeholder */}
      <div className="h-56 animate-pulse rounded-3xl bg-secondary" />

      {/* Filter pills placeholder */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-full bg-secondary"
          />
        ))}
      </div>

      {/* Product grid placeholder */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <div className="aspect-square animate-pulse bg-secondary" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-secondary" />
              <div className="h-9 w-full animate-pulse rounded-lg bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
