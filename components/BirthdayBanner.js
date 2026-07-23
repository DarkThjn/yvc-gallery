import Image from "next/image";

const MONTH_LABELS = [
  "", "Một", "Hai", "Ba", "Tư", "Năm", "Sáu",
  "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Mười Hai"
];

export default function BirthdayBanner({ data }) {
  if (!data || data.members.length === 0) return null;

  if (data.mode === "today") {
    return <TodaySpotlight members={data.members} />;
  }
  return <MonthWall members={data.members} monthLabel={data.monthLabel} />;
}

function TodaySpotlight({ members }) {
  const multiple = members.length > 1;
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
        <h1 className="text-3xl md:text-4xl mb-10">
          Chúc mừng sinh nhật {multiple ? "các thành viên" : "thành viên"}
        </h1>

        <div
          className={`flex flex-wrap justify-center gap-8 ${
            multiple ? "" : "max-w-xs mx-auto"
          }`}
        >
          {members.map((m) => (
            <div key={m.id} className="w-56 shrink-0">
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
              <div className="mt-3">
                <p className="font-display text-lg text-cream">{m.fullName}</p>
                {m.role && <p className="text-sm text-muted">{m.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
