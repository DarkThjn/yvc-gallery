import { notFound } from "next/navigation";
import GalleryBendShowcase from "@/components/GalleryBendShowcase";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const album = await prisma.album.findUnique({
    where: { slug: params.albumId },
    include: { photos: { take: 1 } },
  });

  if (!album) return { title: "Showcase album" };

  const imageUrl =
    album.coverUrl || album.photos[0]?.url || absoluteUrl("/og.png");

  return {
    title: `Showcase ${album.title}`,
    description:
      album.description ||
      `Phiên bản showcase album của ${siteConfig.shortName}.`,
    alternates: { canonical: `/gallery/${album.slug}/showcase` },
    openGraph: {
      title: `Showcase ${album.title} | ${siteConfig.name}`,
      url: absoluteUrl(`/gallery/${album.slug}/showcase`),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: album.title }],
    },
  };
}

export default async function AlbumShowcasePage({ params }) {
  const album = await prisma.album.findUnique({
    where: { slug: params.albumId },
    include: { photos: { orderBy: { createdAt: "asc" } } },
  });

  if (!album || album.photos.length === 0) notFound();

  return (
    <GalleryBendShowcase
      albumTitle={album.title}
      albumDescription={album.description}
      backHref={`/gallery/${album.slug}`}
      photos={album.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        caption: photo.caption,
      }))}
    />
  );
}
