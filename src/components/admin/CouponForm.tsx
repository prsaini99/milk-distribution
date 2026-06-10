"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Coupon, CouponType } from "@/domain";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * Create/edit form for a coupon. `flat` value + min-order are entered in rupees
 * and converted to paise; `percent` value is a plain percentage.
 */
export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter();
  const isEdit = Boolean(coupon);

  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<CouponType>(coupon?.type ?? "percent");
  const [value, setValue] = useState(
    coupon
      ? coupon.type === "percent"
        ? String(coupon.value)
        : String(coupon.value / 100)
      : "",
  );
  const [minOrder, setMinOrder] = useState(
    coupon ? String(coupon.minOrder / 100) : "0",
  );
  const [active, setActive] = useState(coupon?.active ?? true);
  const [description, setDescription] = useState(coupon?.description ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      code,
      type,
      value:
        type === "percent"
          ? Number(value)
          : Math.round(parseFloat(value) * 100),
      minOrder: Math.round(parseFloat(minOrder || "0") * 100),
      active,
      description,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/coupons/${coupon!.id}` : "/api/coupons",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="surface-card max-w-xl space-y-5 p-6"
    >
      <Field label="Coupon code">
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="WELCOME10"
          className={input + " uppercase"}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CouponType)}
            className={input}
          >
            <option value="percent">Percentage off</option>
            <option value="flat">Flat amount off</option>
          </select>
        </Field>
        <Field label={type === "percent" ? "Discount (%)" : "Discount (₹)"}>
          <input
            required
            type="number"
            min="0"
            step={type === "percent" ? "1" : "0.01"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={input}
            placeholder={type === "percent" ? "10" : "50"}
          />
        </Field>
      </div>

      <Field label="Minimum order (₹) — 0 for none">
        <input
          type="number"
          min="0"
          step="0.01"
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
          className={input}
          placeholder="0"
        />
      </Field>

      <Field label="Description (optional)">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={input}
          placeholder="10% off your first order"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="size-4 accent-[var(--primary)]"
        />
        <span className="font-medium text-foreground/80">Active</span>
      </label>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create coupon"}
        </Button>
        <a href="/admin/coupons" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </a>
      </div>
    </form>
  );
}

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </span>
      {children}
    </label>
  );
}
