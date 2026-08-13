import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVietnamDateTime } from "@/lib/vietnamTime";

export const metadata = { title: "Sự kiện" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { startsAt: "desc" }
  });
  const now = new Date();
  const ongoing = events
    .filter((event) => isEventOngoing(event, now))
    .sort((a, b) => new Date(a.endsAt || a.startsAt) - new Date(b.endsAt || b.startsAt));
  const upcoming = events
    .filter((event) => new Date(event.startsAt) > now)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const past = events.filter((event) => {
    const startsAt = new Date(event.startsAt);
    const endsAt = event.endsAt ? new Date(event.endsAt) : null;
    return startsAt <= now && (!endsAt || endsAt < now);
  });

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Lịch hoạt động</p>
      <h1 className="text-3xl mb-10">Sự kiện</h1>

      {ongoing.length > 0 && (
        <EventGroup title="Đang diễn ra" items={ongoing} />
      )}
      <EventGroup title="Sắp diễn ra" items={upcoming} empty="Chưa có sự kiện sắp tới." />
      <EventGroup title="Đã diễn ra" items={past} empty="Chưa có sự kiện nào." />
    </div>
  );
}

function EventGroup({ title, items, empty }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl mb-5">{title}</h2>
      {items.length === 0 && <p className="text-muted frame p-5">{empty}</p>}
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((e) => (
          <Link key={e.id} href={`/events/${e.slug}`} className="frame p-5 block">
            <p className="plaque-label mb-2">
              {formatEventSchedule(e)}
            </p>
            <p className="font-display text-lg">{e.title}</p>
            {e.location && <p className="text-sm text-muted mt-1">{e.location}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

function isEventOngoing(event, now) {
  if (!event.endsAt) return false;
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  return startsAt <= now && endsAt >= now;
}

function formatEventSchedule(event) {
  const startLabel = formatVietnamDateTime(event.startsAt);
  if (!event.endsAt) return startLabel;

  return `${startLabel} - ${formatVietnamDateTime(event.endsAt)}`;
}
