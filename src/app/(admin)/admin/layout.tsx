import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Admin chrome — distinct from the storefront. Sidebar nav + content area.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
