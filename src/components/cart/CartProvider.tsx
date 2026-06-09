"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import type { Product } from "@/domain";
import {
  type CartLine,
  type CartSummary,
  computeSummary,
} from "@/lib/cart";

const STORAGE_KEY = "milkmart_cart";

interface CartContextValue {
  lines: CartLine[];
  summary: CartSummary;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // Corrupt/unavailable storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  // Reconcile the cart against live products once after hydration: refresh
  // each line's snapshot (price/stock/tiers) and drop products that no longer
  // exist. Prevents the cart from showing a stale price the server won't honour.
  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok || !active) return;
        const fresh = (await res.json()) as Product[];
        const byId = new Map(fresh.map((p) => [p.id, p]));
        if (!active) return;

        let removed = 0;
        setLines((prev) => {
          removed = 0;
          const next: CartLine[] = [];
          for (const l of prev) {
            const current = byId.get(l.product.id);
            if (current) next.push({ product: current, quantity: l.quantity });
            else removed++;
          }
          return next;
        });
        if (removed > 0) {
          toast.info(
            `${removed} item${removed === 1 ? "" : "s"} removed — no longer available.`,
          );
        }
      } catch {
        // offline / fetch failed — keep the cart as-is
      }
    })();
    return () => {
      active = false;
    };
  }, [hydrated]);

  const addItem = (product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === productId ? { ...l, quantity } : l,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const clear = () => setLines([]);

  const summary = useMemo(() => computeSummary(lines), [lines]);

  const value: CartContextValue = {
    lines,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Access the cart. Must be used within <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
