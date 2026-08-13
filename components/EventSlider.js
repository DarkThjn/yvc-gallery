"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EventSlider({ events }) {
  const count = events?.length || 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return undefined;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % count);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const event = events[currentIndex] || events[0];

  function goTo(index) {
    setCurrentIndex((index + count) % count);
  }

  return (
    <div className="relative overflow-hidden rounded-frame border border-border bg-surface shadow-[0_22px_70px_rgba(184,95,106,0.10)]">
      <Image
        key={event.id}
        src={event.imageUrl}
        alt={event.title}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 1120px, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff9fb]/94 via-[#fff9fb]/86 to-[#fff9fb]/94 md:bg-gradient-to-r md:from-[#fff9fb]/96 md:via-[#fff9fb]/78 md:to-[#fff9fb]/24" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(242,182,199,0.32),transparent_30%),linear-gradient(180deg,transparent,rgba(85,49,59,0.10))]" />

      <div className="relative z-10 grid min-h-[440px] content-end px-5 py-8 md:min-h-[430px] md:content-center md:px-10">
        <div className="max-w-2xl rounded-frame border border-white/75 bg-white/85 px-5 py-5 shadow-[0_18px_44px_rgba(85,49,59,0.12)] backdrop-blur-md md:px-6 md:py-6">
          <p className="plaque-label mb-3">{event.statusLabel}</p>
          <h3 className="text-3xl leading-tight md:text-4xl">{event.title}</h3>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            <span>{event.dateLabel}</span>
            {event.timeLabel && <span>{event.timeLabel}</span>}
            {event.location && <span>{event.location}</span>}
          </div>
          {event.description && (
            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {event.description}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/events/${event.slug}`} className="btn-gold">
              Xem chi tiết
            </Link>
            <Link href="/events" className="btn-outline bg-white/50">
              Lịch sự kiện
            </Link>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-border bg-white/80 text-xl leading-none text-cream transition hover:border-gold hover:text-gold"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Sự kiện trước"
          >
            ‹
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-2">
            {events.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-gold" : "w-2 bg-border"
                }`}
                onClick={() => goTo(index)}
                aria-label={`Chuyển tới sự kiện ${index + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-border bg-white/80 text-xl leading-none text-cream transition hover:border-gold hover:text-gold"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Sự kiện tiếp theo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
