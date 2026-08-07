"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

function Lightbox({
  photos,
  startIndex,
  albumTitle,
  startPlaying = false,
  onClose,
}) {
  const [current, setCurrent] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(startPlaying && photos.length > 1);

  const goPrev = useCallback(() => {
    setCurrent((index) => (index - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goNext = useCallback(() => {
    setCurrent((index) => (index + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Escape") onClose();
      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((value) => !value);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return undefined;

    const timer = window.setInterval(goNext, 3200);
    return () => window.clearInterval(timer);
  }, [goNext, isPlaying, photos.length]);

  const photo = photos[current];
  if (!photo) return null;
  const createdAt = photo.createdAt ? new Date(photo.createdAt) : null;
  const photoDate =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString("vi-VN")
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
    >
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-3">
        {photos.length > 1 ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsPlaying((value) => !value);
            }}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/20 hover:text-white"
            aria-label={isPlaying ? "Tạm dừng slideshow" : "Bắt đầu slideshow"}
          >
            {isPlaying ? "Tạm dừng" : "Slideshow"}
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onClose}
          className="h-11 w-11 rounded-full bg-white/10 text-3xl leading-none text-white/85 transition hover:bg-white/20 hover:text-white"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 z-10 h-12 w-12 rounded-full bg-white/10 text-4xl leading-none text-white/85 transition hover:bg-white/20 hover:text-white md:left-6"
          aria-label="Ảnh trước"
        >
          ‹
        </button>
      )}

      <div
        className="relative h-[82vh] w-[94vw] max-w-7xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption || albumTitle}
          fill
          className="object-contain"
          sizes="100vw"
          quality={100}
          priority
          unoptimized
        />
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          className="absolute right-3 z-10 h-12 w-12 rounded-full bg-white/10 text-4xl leading-none text-white/85 transition hover:bg-white/20 hover:text-white md:right-6"
          aria-label="Ảnh tiếp"
        >
          ›
        </button>
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-center text-sm text-white/75">
        {photo.caption && <p className="mb-1">{photo.caption}</p>}
        {photoDate && (
          <p className="mb-1 text-xs text-white/55">Thêm ngày {photoDate}</p>
        )}
        <p className="text-xs text-white/50">
          {current + 1} / {photos.length}
        </p>
        <a
          href={photo.url}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto mt-3 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/20 hover:text-white"
          onClick={(event) => event.stopPropagation()}
        >
          Mở file gốc
        </a>
      </div>
    </div>
  );
}

export default function AlbumGalleryLightbox({ photos, albumTitle }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [startPlaying, setStartPlaying] = useState(false);

  function openLightbox(index, playing = false) {
    setStartPlaying(playing);
    setLightboxIndex(index);
  }

  return (
    <>
      {photos.length > 1 && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            className="btn-outline"
            onClick={() => openLightbox(0, true)}
          >
            Slideshow
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="frame group cursor-zoom-in p-2 text-left"
            onClick={() => openLightbox(index)}
            aria-label={`Xem ảnh ${photo.caption || index + 1}`}
            data-reveal
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-frame bg-surfaceLight">
              <Image
                src={photo.url}
                alt={photo.caption || albumTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 50vw"
                quality={90}
              />
            </div>
            {photo.caption && (
              <p className="mt-2 px-1 text-xs text-muted">{photo.caption}</p>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIndex}
          startPlaying={startPlaying}
          albumTitle={albumTitle}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
