import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({ orderBy: { fullName: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Thành viên ({members.length})</h1>
        <Link href="/admin/members/new" className="btn-gold">
          + Thêm thành viên
        </Link>
      </div>

      <div className="frame divide-y divide-border">
        {members.map((m) => {
          const bd = new Date(m.birthDate);
          const joinedAt = new Date(m.joinedAt);
          return (
            <div key={m.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-cream">
                  {m.fullName}{" "}
                  {!m.isActive && <span className="text-xs text-muted">(ngừng hoạt động)</span>}
                </p>
                <p className="text-xs text-muted">
                  {m.role || "Thành viên"} · Sinh nhật {bd.getUTCDate()}/{bd.getUTCMonth() + 1} · Gia nhập{" "}
                  {joinedAt.toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/members/${m.id}`} className="text-gold hover:text-goldSoft">
                  Sửa
                </Link>
                <DeleteButton endpoint={`/api/members/${m.id}`} />
              </div>
            </div>
          );
        })}
        {members.length === 0 && <p className="px-5 py-8 text-muted">Chưa có thành viên nào.</p>}
      </div>
    </div>
  );
}
