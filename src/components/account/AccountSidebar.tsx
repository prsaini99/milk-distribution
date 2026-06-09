"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Store } from "lucide-react";

/**
 * Account navigation. Add a section by appending to NAV and creating the page
 * file — pages no longer render their own nav (the account layout owns it).
 * (Profile lives in the header avatar dropdown.)
 */
const NAV = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="md:w-56 md:shrink-0">
      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border/70 bg-card p-2 [scrollbar-width:none] md:flex-col md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition " +
                (active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground")
              }
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-2 hidden items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground md:flex"
      >
        <Store className="size-4" /> Continue shopping
      </Link>
    </aside>
  );
}
