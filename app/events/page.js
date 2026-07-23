import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Sự kiện" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { startsAt: "desc" }
  });
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startsAt) >= now);
  const past = events.filter((e) => new Date(e.startsAt) < now);

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Lịch hoạt động</p>
      <h1 className="text-3xl mb-10">Sự kiện</h1>

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
              {new Date(e.startsAt).toLocaleDateString("vi-VN")}
            </p>
            <p className="font-display text-lg">{e.title}</p>
            {e.location && <p className="text-sm text-muted mt-1">{e.location}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
