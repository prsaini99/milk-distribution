import Image from "next/image";
import Link from "next/link";
import { Truck, Leaf, ShieldCheck, ArrowRight, Boxes } from "lucide-react";
import { listProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { CatalogueBrowser } from "@/components/shop/CatalogueBrowser";
import { buttonVariants } from "@/components/ui/button";

/**
 * Storefront home. Server component — fetches the catalogue from the service
 * layer; search + category filtering happen client-side in CatalogueBrowser.
 */
export default async function CataloguePage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="surface-panel relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <Image
          src="/catalogue/full-cream-milk.jpg"
          alt="Fresh dairy bottles ready for delivery"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/92 via-foreground/68 to-foreground/18" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-foreground/55 to-transparent" />

        <div className="grid min-h-[420px] content-end gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/14 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <Leaf className="size-3.5" /> Farm-fresh, every single day
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Pure dairy, delivered to your door.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/78">
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
                  className:
                    "border-white/30 bg-white/12 text-white shadow-none backdrop-blur-md hover:bg-white/20 hover:text-white",
                })}
              >
                <Boxes className="size-4" /> Order in bulk
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/84">
              <Chip icon={<Truck className="size-4 text-gold" />}>
                Free delivery over ₹499
              </Chip>
              <Chip icon={<Leaf className="size-4 text-gold" />}>
                100% farm-fresh
              </Chip>
              <Chip icon={<ShieldCheck className="size-4 text-gold" />}>
                Quality tested
              </Chip>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="max-w-xs rounded-2xl border border-white/18 bg-white/14 p-4 text-white shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/18 text-gold">
                  <Truck className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Delivered daily</p>
                  <p className="text-xs text-white/68">
                    Before 8 AM, fresh
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
                <div>
                  <p className="text-2xl font-bold">8 AM</p>
                  <p className="text-xs text-white/64">morning slots</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">₹499</p>
                  <p className="text-xs text-white/64">free delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="scroll-mt-24">
        <CatalogueBrowser products={products} categories={categories} />
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
    <span className="inline-flex items-center gap-2 text-current">
      {icon}
      {children}
    </span>
  );
}
