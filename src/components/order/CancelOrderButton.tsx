"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Customer cancels their own pending order. */
export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cancel failed");
      toast.success("Order cancelled");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cancel failed");
      setBusy(false);
    }
  };

  return (
    <Button variant="outline" onClick={cancel} disabled={busy}>
      {busy ? "Cancelling…" : "Cancel order"}
    </Button>
  );
}
