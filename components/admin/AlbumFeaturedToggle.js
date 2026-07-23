"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AlbumFeaturedToggle({ albumId, initialValue }) {
  const router = useRouter();
  const [checked, setChecked] = useState(Boolean(initialValue));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function toggleFeatured(event) {
    const value = event.target.checked;
    setChecked(value);
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/albums/${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: value }),
      });

      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setChecked(!value);
      setError("Không thể cập nhật trạng thái nổi bật.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="frame p-5">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={toggleFeatured}
          disabled={saving}
          className="mt-1 h-4 w-4 accent-gold"
        />
        <span>
          <span className="block font-medium text-cream">
            Hiển thị ở Khoảnh khắc nổi bật
          </span>
          <span className="mt-1 block text-sm text-muted">
            Album được bật sẽ xuất hiện trong section nổi bật trên trang chủ.
          </span>
        </span>
      </label>
      {error && <p className="mt-2 text-sm text-rose">{error}</p>}
    </div>
  );
}
