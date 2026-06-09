import Link from "next/link";
import { Milk, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { CartBadge } from "@/components/cart/CartBadge";
import { ModeSwitch } from "@/components/shop/ModeSwitch";
import { UserMenu } from "@/components/auth/UserMenu";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getSession } from "@/server/services/auth.service";

/**
 * Storefront chrome — shared header for all customer-facing pages.
 */
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 justify-self-start">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Milk className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">MilkMart</span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Fresh dairy, delivered
              </span>
            </span>
          </Link>

          <div className="justify-self-center">
            <ModeSwitch />
          </div>

          <div className="flex items-center gap-2 justify-self-end sm:gap-3">
            {session?.role === "admin" ? (
              // Admins are previewing the storefront, not shopping as a customer.
              <>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                >
                  <ShieldCheck className="size-4" />
                  <span className="hidden sm:inline">Admin dashboard</span>
                </Link>
                <LogoutButton redirectTo="/login" />
              </>
            ) : (
              <>
                {session ? (
                  <UserMenu email={session.email} />
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
                  >
                    Login
                  </Link>
                )}
                <CartBadge />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="mt-12 border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Milk className="size-4" />
                </span>
                <span className="text-lg font-bold tracking-tight">
                  MilkMart
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Farm-fresh dairy delivered to your door, every day. Retail &amp;
                wholesale.
              </p>
            </div>

            {/* Shop */}
            <FooterCol title="Shop">
              <FooterLink href="/">Retail store</FooterLink>
              <FooterLink href="/bulk">Bulk &amp; wholesale</FooterLink>
              <FooterLink href="/cart">Your cart</FooterLink>
            </FooterCol>

            {/* Company */}
            <FooterCol title="Company">
              <FooterLink href="#">About us</FooterLink>
              <FooterLink href="#">Delivery &amp; returns</FooterLink>
              <FooterLink href="#">Quality promise</FooterLink>
            </FooterCol>

            {/* Contact */}
            <FooterCol title="Get in touch">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-primary" /> +91 98765 43210
              </span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 text-primary" /> hello@milkmart.in
              </span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" /> Pune, Maharashtra
              </span>
            </FooterCol>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 MilkMart. Fresh dairy, delivered.</p>
            <Link
              href="/admin"
              className="transition hover:text-primary"
            >
              Distributor admin →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition hover:text-primary"
    >
      {children}
    </Link>
  );
}
