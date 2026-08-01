import { getServerSession } from "next-auth";
import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminNav from "@/components/AdminNav";
import { authOptions } from "@/lib/auth";

export const metadata = { title: "Quản trị" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session?.error === "SessionReplaced") {
    return (
      <AdminSessionProvider session={session}>
        <main className="grid min-h-screen place-items-center px-5 text-center">
          <div className="frame max-w-sm p-6">
            <p className="text-cream">Phiên đăng nhập này không còn hiệu lực.</p>
            <p className="mt-2 text-sm text-muted">Đang chuyển về trang đăng nhập...</p>
          </div>
        </main>
      </AdminSessionProvider>
    );
  }

  return (
    <AdminSessionProvider session={session}>
      <div className="min-h-screen">
        <AdminNav />
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
