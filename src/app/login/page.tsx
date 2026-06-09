"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Milk } from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo defaults — keep in sync with .env. Shown for quick demo logins.
const DEMO = {
  admin: { email: "admin@milkmart.in", password: "admin123" },
  user: { email: "user@milkmart.in", password: "user123" },
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (creds?: { email: string; password: string }) => {
    const payload = creds ?? { email, password };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");

      // Admin always lands in admin; users honour the `next` target.
      const dest =
        data.role === "admin" ? "/admin" : next || data.redirect || "/";
      router.push(dest);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Milk className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Welcome to MilkMart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/80">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* Demo quick-login */}
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-secondary/30 p-4 text-sm">
          <p className="font-medium">Demo logins</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            One-click sign in for the demo.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => submit(DEMO.user)}
            >
              Customer
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => submit(DEMO.admin)}
            >
              Admin
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-primary">
            ← Continue browsing
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
