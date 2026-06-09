import Image from "next/image";
import Link from "next/link";
import { Truck, Leaf, ShieldCheck, ArrowRight, Boxes } from "lucide-react";
import { listProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { ProductCard } from "@/components/shop/ProductCard";
import { buttonVariants } from "@/components/ui/button";

/**
 * Storefront home / catalogue. Server component — calls the service layer
 * directly. Category filtering is driven by the `?category=<slug>` param.
 */
export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts(category),
    listCategories(),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-secondary to-gold/10">
        <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Leaf className="size-3.5" /> Farm-fresh, every single day
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] sm:text-5xl">
              Pure dairy, delivered to your door.
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground">
              Milk, curd, ghee, paneer and more — sourced fresh from your local
              distributor and delivered daily.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#catalogue"
                className={buttonVariants({ size: "lg" })}
              >
                Shop now <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/bulk"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
              >
                <Boxes className="size-4" /> Order in bulk
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              <Chip icon={<Truck className="size-4 text-primary" />}>
                Free delivery over ₹499
              </Chip>
              <Chip icon={<Leaf className="size-4 text-primary" />}>
                100% farm-fresh
              </Chip>
              <Chip icon={<ShieldCheck className="size-4 text-primary" />}>
                Quality tested
              </Chip>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative ml-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-card shadow-lg">
              <Image
                src="/catalogue/full-cream-milk.jpg"
                alt="Fresh dairy"
                fill
                sizes="(max-width: 1024px) 0px, 28rem"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl bg-card px-4 py-3 shadow-lg">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Delivered daily</p>
                <p className="text-xs text-muted-foreground">
                  Before 8 AM, fresh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="scroll-mt-24 space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Shop our range</h2>
          <span className="text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Category filter — horizontal scroll on mobile */}
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterPill label="All" href="/#catalogue" active={!category} />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              href={`/?category=${c.slug}#catalogue`}
              active={category === c.slug}
            />
          ))}
        </nav>

        {products.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-foreground/80">
      {icon}
      {children}
    </span>
  );
}

function FilterPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition " +
        (active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
      }
    >
      {label}
    </Link>
  );
}
