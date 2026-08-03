import Image from "next/image";
import Link from "next/link";

export default function GalleryBendShowcase({
  albumTitle,
  albumDescription,
  photos,
  backHref,
  backLabel = "Trở về album",
  compact = false,
}) {
  const showcasePhotos = compact ? photos.slice(0, 5) : photos;

  if (showcasePhotos.length === 0) return null;

  return (
    <section
      className={`bend-showcase ${compact ? "bend-showcase--compact" : ""}`}
    >
      <div className="bend-shell">
        <div className="bend-kicker">
          <span>YVC Showcase</span>
          <span>Scroll to bend</span>
        </div>

        <div className="bend-intro">
          <div>
            <h1 className="bend-title">{albumTitle}</h1>
            <p className="bend-copy">
              {albumDescription ||
                "Cuộn qua album để xem các khoảnh khắc đi qua phần gập của phòng trưng bày."}
            </p>
          </div>
          {backHref && (
            <Link href={backHref} className="bend-link">
              {backLabel}
            </Link>
          )}
        </div>

        <div className="bend-scroll-frame">
          <div className="bend-fold-guide bend-fold-guide--top" aria-hidden />
          <div className="bend-fold-guide bend-fold-guide--bottom" aria-hidden />

          <div className="bend-scroll-content">
            {showcasePhotos.map((photo, index) => (
              <article className="bend-memory-panel" key={photo.id}>
                <div className="bend-photo-card">
                  <Image
                    src={photo.url}
                    alt={photo.caption || `${albumTitle} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 760px, 100vw"
                    quality={95}
                  />
                </div>
                <div className="bend-memory-copy">
                  <p className="plaque-label">Frame {index + 1}</p>
                  <h2>{photo.caption || albumTitle}</h2>
                  <p>
                    {index === 0
                      ? "Ảnh đi vào vùng gập phía trên giống demo Canvas UI, rồi trượt qua vùng gập phía dưới khi cuộn tiếp."
                      : "Một khoảnh khắc trong album, đặt trong chế độ showcase để người xem cuộn và cảm nhận chuyển động của bộ sưu tập."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
