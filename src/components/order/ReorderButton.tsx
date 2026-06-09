"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/domain";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";

/**
 * Re-adds a past order's items to the cart using *current* product data
 * (skipping anything no longer available), then sends the user to the cart.
 */
export function ReorderButton({
  items,
}: {
  items: { productId: string; quantity: number }[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);

  const reorder = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/products");
      const products = (await res.json()) as Product[];
      const byId = new Map(products.map((p) => [p.id, p]));

      let added = 0;
      let skipped = 0;
      for (const item of items) {
        const product = byId.get(item.productId);
        if (product && product.inStock) {
          addItem(product, item.quantity);
          added++;
        } else {
          skipped++;
        }
      }

      if (added === 0) {
        toast.error("None of these items are available right now.");
        setBusy(false);
        return;
      }

      toast.success(
        `Added ${added} item${added === 1 ? "" : "s"} to cart` +
          (skipped ? ` · ${skipped} unavailable` : ""),
      );
      router.push("/cart");
    } catch {
      toast.error("Reorder failed");
      setBusy(false);
    }
  };

  return (
    <Button onClick={reorder} disabled={busy}>
      <RotateCcw className="size-4" /> {busy ? "Adding…" : "Reorder"}
    </Button>
  );
}
