import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AlbumPhotoManager from "@/components/admin/AlbumPhotoManager";
import AlbumFeaturedToggle from "@/components/admin/AlbumFeaturedToggle";

export const dynamic = "force-dynamic";

export default async function AlbumDetailPage({ params }) {
  const album = await prisma.album.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { createdAt: "asc" } }, event: true },
  });

  if (!album) notFound();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="plaque-label mb-3">Quản lý album</p>
          <h1 className="text-3xl mb-2">{album.title}</h1>
          {album.description && (
            <p className="text-muted max-w-2xl">{album.description}</p>
          )}
        </div>
        <Link href={`/gallery/${album.slug}`} className="btn-outline">
          Xem trên website
        </Link>
      </div>

      <div className="mb-6">
        <AlbumFeaturedToggle
          albumId={album.id}
          initialValue={album.isFeatured}
        />
      </div>

      <AlbumPhotoManager
        album={{
          id: album.id,
          photos: album.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            caption: photo.caption,
          })),
        }}
      />
    </div>
  );
}
