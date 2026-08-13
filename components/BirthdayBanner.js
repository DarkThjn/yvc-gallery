import Image from "next/image";
import Link from "next/link";
import BirthdayGlowFrame from "./BirthdayGlowFrame";

const MONTH_LABELS = [
  "", "Một", "Hai", "Ba", "Tư", "Năm", "Sáu",
  "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Mười Hai"
];

export default function BirthdayBanner({ data, todayEvents = [] }) {
  const members = data?.members || [];
  const hasTodayBirthdays = data?.mode === "today" && members.length > 0;
  const hasTodayEvents = todayEvents.length > 0;

  if (hasTodayBirthdays || hasTodayEvents) {
    return (
      <>
        <TodaySpotlight
          members={hasTodayBirthdays ? members : []}
          events={todayEvents}
        />
        {!hasTodayBirthdays && data?.mode === "month" && members.length > 0 && (
          <MonthWall members={members} monthLabel={data.monthLabel} />
        )}
      </>
    );
  }

  if (data?.mode === "month" && members.length > 0) {
    return <MonthWall members={members} monthLabel={data.monthLabel} />;
  }

  return null;
}

function TodaySpotlight({ members, events = [] }) {
  const hasBirthdays = members.length > 0;
  const hasEvents = events.length > 0;
  const multiple = members.length > 1;
  const heading = hasBirthdays
    ? `Chúc mừng sinh nhật ${multiple ? "các thành viên" : "thành viên"}`
    : "Sự kiện diễn ra hôm nay";

  return (
    <section className="relative overflow-hidden border-y border-gold/25 bg-gradient-to-b from-surface via-ink to-ink">
      {/* vệt ánh sáng spotlight */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 90% at 50% -10%, rgba(212,160,84,0.16), transparent 70%)"
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 py-14 text-center">
        <p className="plaque-label mb-4">Đang trưng bày hôm nay</p>
        <h1 className="text-3xl md:text-4xl mb-10">{heading}</h1>

        {hasBirthdays && (
          <div
            className={`flex flex-wrap justify-center gap-8 ${
              multiple ? "" : "max-w-xs mx-auto"
            }`}
          >
            {members.map((m) => (
              <div key={m.id} className="w-56 shrink-0">
                <BirthdayGlowFrame>
                  <div className="frame p-3">
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-frame bg-surfaceLight">
                      {m.photoUrl ? (
                        <Image
                          src={m.photoUrl}
                          alt={m.fullName}
                          fill
                          className="object-cover"
                          sizes="224px"
                        />
                      ) : (
                        <PlaceholderPortrait name={m.fullName} />
                      )}
                    </div>
                  </div>
                </BirthdayGlowFrame>
                <div className="mt-3">
                  <p className="font-display text-lg text-cream">{m.fullName}</p>
                  {m.role && <p className="text-sm text-muted">{m.role}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasEvents && (
          <div className={hasBirthdays ? "mt-12" : ""}>
            <p className="plaque-label mb-5">Sự kiện hôm nay</p>
            <div className="grid gap-5 md:grid-cols-2">
              {events.map((event) => (
                <TodayEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TodayEventCard({ event }) {
  return (
    <BirthdayGlowFrame className="text-left">
      <Link
        href={`/events/${event.slug}`}
        className="frame group grid gap-4 p-3 text-left transition-colors hover:border-gold md:grid-cols-[180px_1fr]"
      >
        <div className="relative aspect-video overflow-hidden rounded-frame bg-surfaceLight md:aspect-[4/3]">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 180px, 100vw"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <p className="plaque-label mb-2">{event.timeLabel || event.dateLabel}</p>
          <p className="font-display text-xl leading-tight text-cream">
            {event.title}
          </p>
          {event.location && (
            <p className="mt-2 text-sm text-muted">{event.location}</p>
          )}
        </div>
      </Link>
    </BirthdayGlowFrame>
  );
}

function MonthWall({ members, monthLabel }) {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <p className="plaque-label mb-2">Bộ sưu tập tháng {MONTH_LABELS[monthLabel]}</p>
        <h2 className="text-2xl mb-8">Sinh nhật thành viên trong tháng này</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {members.map((m) => (
            <div key={m.id} className="frame p-2.5 text-center">
              <div className="relative w-full aspect-square overflow-hidden rounded-frame bg-surfaceLight mb-2">
                {m.photoUrl ? (
                  <Image
                    src={m.photoUrl}
                    alt={m.fullName}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                ) : (
                  <PlaceholderPortrait name={m.fullName} small />
                )}
              </div>
              <p className="text-sm text-cream leading-tight truncate">{m.fullName}</p>
              <p className="plaque-label !text-[10px] mt-1">Ngày {m.day}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaceholderPortrait({ name, small }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`font-display text-gold/60 ${small ? "text-2xl" : "text-5xl"}`}>
        {initial}
      </span>
    </div>
  );
}
