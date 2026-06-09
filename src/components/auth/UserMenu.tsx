"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

/**
 * Header account avatar. Click to reveal name, email, profile and logout.
 */
export function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const initial = (name || email).charAt(0).toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/20"
      >
        {initial}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-secondary/60"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </Link>

            <div className="border-t border-border/60 p-1">
              <Link
                href="/account/profile"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <UserCog className="size-4" /> Profile
              </Link>
              <LogoutButton
                redirectTo="/"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
