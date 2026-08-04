import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AlbumGalleryLightbox from "@/components/AlbumGalleryLightbox";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const album = await prisma.album.findUnique({
    where: { slug: params.albumId },
    include: { photos: { take: 1 } },
  });

  if (!album) return { title: "Album không tồn tại" };

  const imageUrl =
    album.coverUrl || album.photos[0]?.url || absoluteUrl("/og.png");
  const description =
    album.description ||
    `Album ảnh trong phòng trưng bày của ${siteConfig.shortName}.`;

  return {
    title: album.title,
    description,
    alternates: { canonical: `/gallery/${album.slug}` },
    openGraph: {
      title: `${album.title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/gallery/${album.slug}`),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: album.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: album.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AlbumDetailPage({ params }) {
  const album = await prisma.album.findUnique({
    where: { slug: params.albumId },
    include: { photos: { orderBy: { createdAt: "asc" } }, event: true },
  });

  if (!album) notFound();

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Album</p>
      <h1 className="text-3xl mb-2">{album.title}</h1>
      {album.description && (
        <p className="text-muted mb-8 max-w-2xl">{album.description}</p>
      )}
      {album.photos.length === 0 ? (
        <p className="text-muted frame p-6">Album này chưa có ảnh nào.</p>
      ) : (
        <AlbumGalleryLightbox
          photos={album.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            caption: photo.caption,
            createdAt: photo.createdAt.toISOString(),
          }))}
          albumTitle={album.title}
        />
      )}
    </div>
  );
}
