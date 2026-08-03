"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function GalleryBendShowcase({
  albumTitle,
  albumDescription,
  photos,
  backHref,
  compact = false,
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(photos.length > 1);
  const photo = photos[current];

  const goPrev = useCallback(() => {
    setCurrent((index) => (index - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goNext = useCallback(() => {
    setCurrent((index) => (index + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!playing || photos.length <= 1) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return undefined;

    const timer = window.setInterval(goNext, 4200);
    return () => window.clearInterval(timer);
  }, [goNext, photos.length, playing]);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === " ") {
        event.preventDefault();
        setPlaying((value) => !value);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (!photo) return null;

  const imageStyle = { "--bend-image": `url("${photo.url}")` };

  return (
    <section
      className={`bend-showcase ${compact ? "bend-showcase--compact" : ""}`}
    >
      <div className="bend-shell">
        <div className="bend-kicker">
          <span>YVC Showcase</span>
          <span>
            {current + 1}/{photos.length}
          </span>
        </div>

        <div className="bend-stage" style={imageStyle}>
          <div
            className="bend-slide"
            role="img"
            aria-label={photo.caption || albumTitle}
          >
            <div className="bend-fold bend-fold--top" />
            <div className="bend-face" />
            <div className="bend-fold bend-fold--bottom" />
          </div>
        </div>

        <div className="bend-caption-row">
          <div>
            <h1 className="bend-title">{albumTitle}</h1>
            <p className="bend-copy">
              {photo.caption || albumDescription || "Một lát cắt nhỏ trong phòng trưng bày của YVC."}
            </p>
          </div>

          <div className="bend-actions" aria-label="Điều khiển showcase">
            {backHref && (
              <Link href={backHref} className="bend-link">
                Trở về album
              </Link>
            )}
            <button type="button" onClick={goPrev} aria-label="Ảnh trước">
              ‹
            </button>
            <button type="button" onClick={goNext} aria-label="Ảnh tiếp">
              ›
            </button>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Tạm dừng" : "Tự chạy"}
            >
              {playing ? "II" : "▶"}
            </button>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="bend-thumbs" aria-label="Ảnh trong showcase">
            {photos.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === current ? "is-active" : ""}
                onClick={() => {
                  setCurrent(index);
                  setPlaying(false);
                }}
                style={{ backgroundImage: `url("${item.url}")` }}
                aria-label={`Mở ảnh ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
