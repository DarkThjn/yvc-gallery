"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";

export default function ZoomableImage({
  src,
  alt,
  caption,
  className = "",
  imageClassName = "object-cover",
  sizes = "100vw",
  priority = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const label = caption || alt || "Ảnh";

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKey(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`group relative block cursor-zoom-in overflow-hidden rounded-frame text-left ${className}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Phóng to ảnh: ${label}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`${imageClassName} transition-transform duration-300 group-hover:scale-[1.02]`}
          sizes={sizes}
          quality={92}
          priority={priority}
        />
        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex justify-end opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            Xem ảnh gốc
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 px-4 py-14 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-4">
            <p
              id={titleId}
              className="min-w-0 truncate text-sm font-medium text-white/80"
            >
              {label}
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-11 w-11 shrink-0 rounded-full bg-white/10 text-3xl leading-none text-white/85 transition hover:bg-white/20 hover:text-white"
              aria-label="Đóng ảnh phóng to"
            >
              ×
            </button>
          </div>

          <div
            className="relative h-[82svh] w-[94vw] max-w-[1600px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
              priority
              unoptimized
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-3 text-xs text-white/65">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/10 px-3 py-1.5 text-white/85 transition hover:bg-white/20 hover:text-white"
              onClick={(event) => event.stopPropagation()}
            >
              Mở file gốc
            </a>
            <span>Esc để đóng</span>
          </div>
        </div>
      )}
    </>
  );
}
