"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

/** Deletes a product after confirmation, then refreshes the list. */
export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      toast.success(`${productName} deleted`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete ${productName}`}
      className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
