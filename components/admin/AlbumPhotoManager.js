"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AlbumPhotoManager({ album }) {
  const router = useRouter();
  const [pendingUrls, setPendingUrls] = useState([]);
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  function handleUploaded(urls) {
    const nextUrls = Array.isArray(urls) ? urls : [urls];
    setPendingUrls((current) => [...current, ...nextUrls.filter(Boolean)]);
  }

  function removePending(index) {
    setPendingUrls((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function handleAddPhoto() {
    if (pendingUrls.length === 0) return;
    setAdding(true);
    setError("");
    try {
      await Promise.all(
        pendingUrls.map(async (url) => {
          const res = await fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ albumId: album.id, url, caption: caption.trim() || null })
          });
          if (!res.ok) throw new Error("create photo failed");
        })
      );

      setPendingUrls([]);
      setCaption("");
      router.refresh();
    } catch {
      setError("Không thể thêm ảnh vào album, thử lại nhé.");
    } finally {
      setAdding(false);
    }
  }

  async function setCover(url) {
    await fetch(`/api/albums/${album.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverUrl: url })
    });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="frame p-6 max-w-lg space-y-4">
        <p className="plaque-label">Thêm ảnh mới</p>
        <ImageUploader
          value={pendingUrls}
          onChange={handleUploaded}
          label="Chọn ảnh"
          multiple
          showPreview={false}
        />
        {pendingUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {pendingUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative aspect-square overflow-hidden rounded-frame border border-border bg-surfaceLight">
                <Image src={url} alt="" fill className="object-cover" sizes="160px" />
                <button
                  type="button"
                  onClick={() => removePending(index)}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink/75 text-cream transition hover:bg-rose hover:text-white"
                  aria-label="Bỏ ảnh này"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="label">Chú thích chung (không bắt buộc)</label>
          <input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        {error && <p className="text-sm text-rose">{error}</p>}
        <button onClick={handleAddPhoto} disabled={pendingUrls.length === 0 || adding} className="btn-gold">
          {adding
            ? "Đang thêm..."
            : pendingUrls.length > 1
              ? `Thêm ${pendingUrls.length} ảnh vào album`
              : "Thêm vào album"}
        </button>
      </div>

      <div>
        <p className="plaque-label mb-4">Ảnh trong album ({album.photos.length})</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {album.photos.map((p) => (
            <div key={p.id} className="frame p-2">
              <div className="relative w-full aspect-square overflow-hidden rounded-frame bg-surfaceLight">
                <Image src={p.url} alt={p.caption || ""} fill className="object-cover" sizes="200px" />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <button onClick={() => setCover(p.url)} className="text-gold hover:text-goldSoft">
                  Đặt làm ảnh bìa
                </button>
                <DeleteButton endpoint={`/api/photos/${p.id}`} label="Xoá" />
              </div>
            </div>
          ))}
        </div>
        {album.photos.length === 0 && <p className="text-muted text-sm">Chưa có ảnh nào.</p>}
      </div>
    </div>
  );
}
