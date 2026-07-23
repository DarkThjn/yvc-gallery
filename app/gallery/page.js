import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Phòng trưng bày" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await prisma.album.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1 }, event: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Phòng trưng bày</p>
      <h1 className="text-3xl mb-10">Toàn bộ album</h1>

      {albums.length === 0 && (
        <p className="text-muted frame p-6">
          Chưa có album nào. Thêm album trong trang quản trị.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((a) => (
          <Link
            key={a.id}
            href={`/gallery/${a.slug}`}
            className="group frame p-3"
            data-reveal
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-frame bg-surfaceLight">
              {(a.coverUrl || a.photos[0]?.url) && (
                <Image
                  src={a.coverUrl || a.photos[0].url}
                  alt={a.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="320px"
                />
              )}
            </div>
            <div className="mt-3">
              <p className="font-display text-lg">{a.title}</p>
              {a.event && <p className="plaque-label mt-1">{a.event.title}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
