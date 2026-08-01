import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminNav from "@/components/AdminNav";
import { authOptions } from "@/lib/auth";

export const metadata = { title: "Quản trị" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session?.error === "SessionReplaced") {
    redirect("/api/auth/force-signout?reason=session-replaced");
  }

  return (
    <AdminSessionProvider>
      <div className="min-h-screen">
        <AdminNav />
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
