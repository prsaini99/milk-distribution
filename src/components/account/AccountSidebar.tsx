"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Repeat, Store, User } from "lucide-react";

/**
 * Account navigation — a full-height left rail (anchored, app-shell style like
 * the admin), collapsing to a horizontal strip on mobile. Add a section by
 * appending to NAV and creating the page file. (Profile lives in the header
 * avatar dropdown.)
 */
const NAV = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/subscriptions", label: "Subscriptions", icon: Repeat },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="md:w-60 md:shrink-0">
      <div className="surface-card flex gap-1 overflow-x-auto p-2 [scrollbar-width:none] md:h-full md:flex-col md:p-3 [&::-webkit-scrollbar]:hidden">
        {/* Rail header (desktop) */}
        <div className="hidden items-center gap-2.5 px-2 py-3 md:flex">
          <span className="icon-tile size-9">
            <User className="size-5" />
          </span>
          <div className="leading-none">
            <p className="font-bold tracking-tight">My Account</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Orders &amp; settings
            </p>
          </div>
        </div>

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

        <Link
          href="/"
          className="mt-1 hidden items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground md:mt-auto md:flex md:border-t md:border-border/60 md:pt-3"
        >
          <Store className="size-4" /> Continue shopping
        </Link>
      </div>
    </aside>
  );
}
