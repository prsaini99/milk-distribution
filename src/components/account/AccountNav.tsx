"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, UserCog } from "lucide-react";

const TABS = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/profile", label: "Profile", icon: UserCog },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-full border border-border/70 bg-card p-1">
      {TABS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition " +
              (active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
