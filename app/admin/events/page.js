import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startsAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Sự kiện ({events.length})</h1>
        <Link href="/admin/events/new" className="btn-gold">+ Thêm sự kiện</Link>
      </div>

      <div className="frame divide-y divide-border">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-cream">
                {e.title} {!e.isPublished && <span className="text-xs text-muted">(nháp)</span>}
              </p>
              <p className="text-xs text-muted">{new Date(e.startsAt).toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/events/${e.id}`} className="text-gold hover:text-goldSoft">Sửa</Link>
              <DeleteButton endpoint={`/api/events/${e.id}`} />
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="px-5 py-8 text-muted">Chưa có sự kiện nào.</p>}
      </div>
    </div>
  );
}
