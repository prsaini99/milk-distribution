import Link from "next/link";
import { CartBadge } from "@/components/cart/CartBadge";

/**
 * Storefront chrome — shared header for all customer-facing pages.
 * The cart indicator is wired up in the Cart module (Step 4).
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🥛</span>
            <span>MilkMart</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Shop
            </Link>
            <CartBadge />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="border-t py-6 text-center text-sm text-slate-400">
        MilkMart · Fresh dairy delivered daily
      </footer>
    </div>
  );
}
