"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/** Logs out (clears the session cookie) then navigates to `redirectTo`. */
export function LogoutButton({
  redirectTo = "/",
  className,
  label = "Logout",
}: {
  redirectTo?: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      disabled={busy}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
      }
    >
      <LogOut className="size-4" />
      {label}
    </button>
  );
}
