import { AccountSidebar } from "@/components/account/AccountSidebar";

/**
 * Account chrome — an app-shell layout: a full-height left rail (anchored,
 * like the admin) + content, sitting inside the storefront header. The
 * min-height keeps the rail tall so the page reads as a framed layout rather
 * than floating cards.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:min-h-[34rem] md:flex-row md:items-stretch md:gap-8">
      <AccountSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
