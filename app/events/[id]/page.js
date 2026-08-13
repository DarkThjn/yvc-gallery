import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import ZoomableImage from "@/components/ZoomableImage";
import { formatVietnamDateTime } from "@/lib/vietnamTime";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const event = await prisma.event.findUnique({ where: { slug: params.id } });
  if (!event) return { title: "Sự kiện không tồn tại" };

  const description =
    event.description || `Sự kiện của ${siteConfig.shortName}.`;
  const imageUrl = event.coverUrl || absoluteUrl("/og.png");

  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: `${event.title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/events/${event.slug}`),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EventDetailPage({ params }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.id },
    include: { albums: true },
  });
  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Sự kiện</p>
      <h1 className="text-3xl mb-2">{event.title}</h1>
      <p className="text-sm text-muted mb-8">
        {formatVietnamDateTime(event.startsAt)}
        {event.location ? ` · ${event.location}` : ""}
      </p>

      {event.coverUrl && (
        <ZoomableImage
          src={event.coverUrl}
          alt={event.title}
          className="mb-8 aspect-video w-full frame"
          sizes="768px"
          priority
        />
      )}

      {event.description && (
        <p className="text-cream/90 leading-relaxed mb-10 whitespace-pre-line">
          {event.description}
        </p>
      )}

      {event.albums.length > 0 && (
        <div>
          <h2 className="text-xl mb-4">Album ảnh liên quan</h2>
          <div className="flex flex-wrap gap-4">
            {event.albums.map((a) => (
              <Link
                key={a.id}
                href={`/gallery/${a.slug}`}
                className="btn-outline"
              >
                {a.title} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
