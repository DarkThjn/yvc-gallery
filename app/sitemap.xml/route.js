import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/siteConfig";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/gallery", priority: 0.9, changeFrequency: "weekly" },
  { path: "/members", priority: 0.85, changeFrequency: "weekly" },
  { path: "/events", priority: 0.75, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.75, changeFrequency: "weekly" },
  { path: "/recruitment", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export async function GET() {
  const now = new Date();
  const [albums, events, posts, members] = await Promise.all([
    prisma.album.findMany({
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      where: { isPublished: true },
      select: { slug: true, createdAt: true, startsAt: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true, createdAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.member.findMany({
      where: {
        OR: [{ isActive: true, isAlumni: false }, { isAlumni: true }],
      },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const urls = [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...albums.map((album) => ({
      url: absoluteUrl(`/gallery/${album.slug}`),
      lastModified: album.createdAt,
      changeFrequency: "monthly",
      priority: 0.65,
    })),
    ...events.map((event) => ({
      url: absoluteUrl(`/events/${event.slug}`),
      lastModified: event.createdAt || event.startsAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt || post.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...members.map((member) => ({
      url: absoluteUrl(`/members/${member.id}`),
      lastModified: member.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(renderUrl).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}

function renderUrl(entry) {
  return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
