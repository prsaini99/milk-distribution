import { AccountSidebar } from "@/components/account/AccountSidebar";

/**
 * Account chrome — a persistent sidebar (left on desktop, a scrollable strip
 * on mobile) shared by every account page. Sits inside the storefront header.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      <AccountSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
