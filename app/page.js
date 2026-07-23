import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getBirthdayBannerData } from "@/lib/birthday";
import BirthdayBanner from "@/components/BirthdayBanner";

const HOME_BACKDROP_URL = "/home-background.jpg";

// Luôn tính lại banner sinh nhật theo ngày thực tế mỗi khi có người truy cập,
// không dùng cache tĩnh cho trang này.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [banner, featuredAlbums, recentAlbums, upcomingEvents, latestPosts] =
    await Promise.all([
      getBirthdayBannerData(),
      prisma.album.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { photos: { take: 1 } },
      }),
      prisma.album.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { photos: { take: 1 } },
      }),
      prisma.event.findMany({
        where: { isPublished: true, startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 3,
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);
  return (
    <div
      className="home-fixed-backdrop"
      style={{ "--home-backdrop": `url("${HOME_BACKDROP_URL}")` }}
    >
      <Hero />
      <BirthdayBanner data={banner} />

      {featuredAlbums.length > 0 && (
        <Section
          eyebrow="Điểm nhấn"
          title="Khoảnh khắc nổi bật"
          cta={{ href: "/gallery", label: "Xem phòng trưng bày" }}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {featuredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} large />
            ))}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Phòng trưng bày"
        title="Khoảnh khắc gần đây"
        cta={{ href: "/gallery", label: "Xem toàn bộ" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {recentAlbums.length === 0 && (
            <EmptyNote text="Chưa có album nào được thêm." />
          )}
          {recentAlbums.map((a) => (
            <Link
              key={a.id}
              href={`/gallery/${a.slug}`}
              className="group frame p-2.5"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-frame bg-surfaceLight">
                {(a.coverUrl || a.photos[0]?.url) && (
                  <Image
                    src={a.coverUrl || a.photos[0].url}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="240px"
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-cream truncate">{a.title}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Lịch hoạt động"
        title="Sự kiện sắp diễn ra"
        cta={{ href: "/events", label: "Xem tất cả sự kiện" }}
      >
        <div className="grid md:grid-cols-3 gap-5">
          {upcomingEvents.length === 0 && (
            <EmptyNote text="Hiện chưa có sự kiện nào sắp diễn ra." />
          )}
          {upcomingEvents.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="frame p-5 block"
            >
              <p className="plaque-label mb-2">
                {new Date(e.startsAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="font-display text-lg">{e.title}</p>
              {e.location && (
                <p className="text-sm text-muted mt-1">{e.location}</p>
              )}
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Tin tức"
        title="Bài viết mới"
        cta={{ href: "/blog", label: "Xem tất cả bài viết" }}
      >
        <div className="grid md:grid-cols-3 gap-5">
          {latestPosts.length === 0 && (
            <EmptyNote text="Chưa có bài viết nào." />
          )}
          {latestPosts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="frame p-5 block"
            >
              <p className="font-display text-lg mb-2">{p.title}</p>
              {p.excerpt && (
                <p className="text-sm text-muted line-clamp-3">{p.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Hero() {
  return (
    <section className="home-hero-band">
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-10 text-center">
        <p className="plaque-label mb-4">Bộ sưu tập của chúng tôi</p>
        <h1 className="text-4xl md:text-5xl leading-tight mb-4">
          Mỗi kỷ niệm, <span className="italic text-gold">một khung hình</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Nơi lưu giữ và trưng bày những khoảnh khắc đáng nhớ của câu lạc bộ —
          từ hoạt động thường kỳ đến những dấu mốc của từng thành viên.
        </p>
      </div>
    </section>
  );
}

function AlbumCard({ album, large = false }) {
  const imageUrl = album.coverUrl || album.photos[0]?.url;

  return (
    <Link
      href={`/gallery/${album.slug}`}
      className="group frame block p-3"
      data-reveal
    >
      <div
        className={`relative w-full overflow-hidden rounded-frame bg-surfaceLight ${
          large ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={large ? "(min-width: 768px) 33vw, 100vw" : "240px"}
          />
        )}
      </div>
      <p className="mt-3 truncate font-display text-lg text-cream">
        {album.title}
      </p>
      {large && album.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {album.description}
        </p>
      )}
    </Link>
  );
}

function Section({ eyebrow, title, cta, children }) {
  return (
    <section className="home-section-band" data-reveal>
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="plaque-label mb-2">{eyebrow}</p>
            <h2 className="text-2xl">{title}</h2>
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="text-sm text-gold hover:text-goldSoft whitespace-nowrap"
            >
              {cta.label} →
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function EmptyNote({ text }) {
  return <p className="text-muted text-sm frame p-5 col-span-full">{text}</p>;
}
