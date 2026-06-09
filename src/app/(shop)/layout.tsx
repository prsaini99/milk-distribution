import Link from "next/link";
import { Milk } from "lucide-react";
import { CartBadge } from "@/components/cart/CartBadge";
import { ModeSwitch } from "@/components/shop/ModeSwitch";

/**
 * Storefront chrome — shared header for all customer-facing pages.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 justify-self-start">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Milk className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">MilkMart</span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Fresh dairy, delivered
              </span>
            </span>
          </Link>

          <div className="justify-self-center">
            <ModeSwitch />
          </div>

          <div className="justify-self-end">
            <CartBadge />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="mt-8 border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Milk className="size-4 text-primary" />
            MilkMart
          </div>
          <p className="mt-1">
            Farm-fresh dairy delivered to your door, every day.
          </p>
          <Link
            href="/admin"
            className="mt-3 inline-block text-xs text-muted-foreground/70 transition hover:text-primary"
          >
            Distributor admin →
          </Link>
        </div>
      </footer>
    </div>
  );
}
