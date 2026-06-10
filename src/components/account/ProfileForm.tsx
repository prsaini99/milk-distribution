"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Address, User } from "@/domain";
import { Button } from "@/components/ui/button";

/** Lets a customer edit their name + delivery address (email is read-only). */
export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState<Address>(user.address);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof Address, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="surface-card max-w-xl space-y-5 p-6"
    >
      <Field label="Name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Email (your login — can't be changed)">
        <input value={user.email} disabled className={inputClass + " opacity-60"} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Address" className="sm:col-span-2">
          <input
            required
            value={address.line1}
            onChange={(e) => setField("line1", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="City">
          <input
            required
            value={address.city}
            onChange={(e) => setField("city", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Pincode">
          <input
            required
            value={address.pincode}
            onChange={(e) => setField("pincode", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone" className="sm:col-span-2">
          <input
            required
            value={address.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

const inputClass = "field-control px-3 py-2 text-sm";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={"block " + (className ?? "")}>
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </span>
      {children}
    </label>
  );
}
