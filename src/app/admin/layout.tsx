import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "Admin - EUTRIV" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
