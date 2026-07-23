import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Quản trị" };

export default function AdminLayout({ children }) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen">
        <AdminNav />
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
