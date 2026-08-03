import { getServerSession } from "next-auth";
import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminNav from "@/components/AdminNav";
import { authOptions } from "@/lib/auth";

export const metadata = { title: "Quản trị" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <AdminSessionProvider session={session}>
      <div className="min-h-screen">
        <AdminNav />
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
