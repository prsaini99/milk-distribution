"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Boxes } from "lucide-react";

/**
 * Segmented toggle between the Retail storefront and the Bulk/Wholesale
 * section. Sits in the centre of the header on every shop page.
 */
export function ModeSwitch() {
  const pathname = usePathname();
  const isBulk = pathname.startsWith("/bulk");

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/60 p-1">
      <Segment href="/" active={!isBulk} icon={<Store className="size-4" />}>
        Retail
      </Segment>
      <Segment href="/bulk" active={isBulk} icon={<Boxes className="size-4" />}>
        Bulk
      </Segment>
    </div>
  );
}

function Segment({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition " +
        (active
          ? "bg-card text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      {icon}
      {children}
    </Link>
  );
}
