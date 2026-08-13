import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getBirthdayBannerData } from "@/lib/birthday";
import BirthdayBanner from "@/components/BirthdayBanner";
import EventSlider from "@/components/EventSlider";

const HOME_BACKDROP_URL = "/IMG_5574.webp";
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

// Luôn tính lại banner sinh nhật theo ngày thực tế mỗi khi có người truy cập,
// không dùng cache tĩnh cho trang này.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todayRange = getVietnamDayRange();
  const [banner, featuredAlbums, recentAlbums, homeEvents, latestPosts] =
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
        where: { isPublished: true },
        orderBy: { startsAt: "asc" },
        include: {
          albums: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { photos: { take: 1 } },
          },
        },
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  const todayEvents = homeEvents
    .filter((event) => isEventHappeningToday(event, todayRange))
    .map((event) => serializeHomeEvent(event, todayRange));
  const eventSlides = buildHomeEventSlides(homeEvents, todayRange);

  return (
    <div
      className="home-fixed-backdrop"
      style={{ "--home-backdrop": `url("${HOME_BACKDROP_URL}")` }}
    >
      <Hero />
      <BirthdayBanner data={banner} todayEvents={todayEvents} />

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
        title="Sự kiện đang/sắp diễn ra"
        cta={{ href: "/events", label: "Xem tất cả sự kiện" }}
      >
        {eventSlides.length > 0 ? (
          <EventSlider events={eventSlides} />
        ) : (
          <EmptyNote text="Hiện chưa có sự kiện nào sắp diễn ra." />
        )}
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
        <p className="plaque-label mb-4">YVC Gallery</p>
        <h1 className="text-4xl md:text-5xl leading-tight mb-4">
          YVC – <span className="italic text-gold">CLB Văn nghệ YP1</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Website chính thức lưu giữ album, sự kiện, tin tức và những khoảnh khắc
          đáng nhớ của YVC – Câu lạc bộ Văn nghệ Yên Phong số 1.
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

function buildHomeEventSlides(events, todayRange) {
  const activeOrUpcoming = events.filter((event) => {
    const end = event.endsAt ? new Date(event.endsAt) : new Date(event.startsAt);
    return end >= todayRange.start;
  });
  const source =
    activeOrUpcoming.length > 0
      ? activeOrUpcoming
      : [...events].sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

  return source
    .slice(0, 6)
    .map((event) => serializeHomeEvent(event, todayRange));
}

function serializeHomeEvent(event, todayRange) {
  const album = event.albums?.[0];
  const imageUrl =
    event.coverUrl ||
    album?.coverUrl ||
    album?.photos?.[0]?.url ||
    HOME_BACKDROP_URL;
  const isToday = isEventHappeningToday(event, todayRange);
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;
  const now = new Date();
  const isOngoing = startsAt <= now && endsAt && endsAt >= now;

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    imageUrl,
    dateLabel: formatEventDateRange(startsAt, endsAt),
    timeLabel: formatEventTimeRange(startsAt, endsAt),
    statusLabel: isToday
      ? "Diễn ra hôm nay"
      : isOngoing
        ? "Đang diễn ra"
        : startsAt > now
          ? "Sắp diễn ra"
          : "Dấu mốc đã qua",
  };
}

function isEventHappeningToday(event, todayRange) {
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : startsAt;
  return startsAt <= todayRange.end && endsAt >= todayRange.start;
}

function getVietnamDayRange(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const dateKey = `${values.year}-${values.month}-${values.day}`;

  return {
    start: new Date(`${dateKey}T00:00:00.000+07:00`),
    end: new Date(`${dateKey}T23:59:59.999+07:00`),
  };
}

function formatEventDateRange(startsAt, endsAt) {
  const startLabel = formatVietnamDate(startsAt);
  if (!endsAt) return startLabel;

  const endLabel = formatVietnamDate(endsAt);
  return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
}

function formatEventTimeRange(startsAt, endsAt) {
  const startLabel = formatVietnamTime(startsAt);
  if (!endsAt) return startLabel;

  const endLabel = formatVietnamTime(endsAt);
  return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
}

function formatVietnamDate(date) {
  return date.toLocaleDateString("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatVietnamTime(date) {
  return date.toLocaleTimeString("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}
