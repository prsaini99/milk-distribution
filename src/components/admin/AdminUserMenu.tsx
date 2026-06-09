"use client";

import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";

/**
 * Admin header avatar. Click to reveal name, email and logout.
 */
export function AdminUserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const initial = email.charAt(0).toUpperCase() || "A";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        {initial}
      </button>

      {open && (
        <>
          {/* click-outside backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">Administrator</p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>

            <div className="border-t border-border/60 p-1">
              <LogoutButton
                redirectTo="/login"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
