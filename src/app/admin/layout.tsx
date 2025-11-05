import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata = {
  title: "Admin - EUTRIV",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
