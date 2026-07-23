import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await prisma.album.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true, event: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Album ({albums.length})</h1>
        <Link href="/admin/gallery/new" className="btn-gold">
          + Thêm album
        </Link>
      </div>

      <div className="frame divide-y divide-border">
        {albums.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-cream">{a.title}</p>
                {a.isFeatured && (
                  <span className="rounded-frame border border-gold/40 bg-surfaceLight px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-gold">
                    Nổi bật
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">
                {a.photos.length} ảnh{" "}
                {a.event ? `· Sự kiện: ${a.event.title}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href={`/admin/gallery/${a.id}`}
                className="text-gold hover:text-goldSoft"
              >
                Quản lý ảnh
              </Link>
              <DeleteButton
                endpoint={`/api/albums/${a.id}`}
                confirmText="Xoá album này và toàn bộ ảnh bên trong?"
              />
            </div>
          </div>
        ))}
        {albums.length === 0 && (
          <p className="px-5 py-8 text-muted">Chưa có album nào.</p>
        )}
      </div>
    </div>
  );
}
