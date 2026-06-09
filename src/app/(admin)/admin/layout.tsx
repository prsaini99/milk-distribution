import { ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";
import { getSession } from "@/server/services/auth.service";

/**
 * Admin chrome — sidebar nav + a top header with the admin's account menu.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border/60 bg-card/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-primary" />
              <span className="font-semibold">Distributor Dashboard</span>
            </div>
            <AdminUserMenu email={session?.email ?? "admin@milkmart.in"} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
