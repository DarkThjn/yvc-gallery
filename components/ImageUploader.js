"use client";

import { useState } from "react";
import Image from "next/image";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({
  value,
  onChange,
  label = "Ảnh",
  multiple = false,
  showPreview = true,
}) {
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setCompleted(0);
    setTotal(files.length);
    setError("");

    const invalidType = files.find(
      (file) => !ACCEPTED_IMAGE_TYPES.includes(file.type),
    );
    if (invalidType) {
      setError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
      event.target.value = "";
      return;
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setError("Mỗi ảnh cần nhỏ hơn hoặc bằng 8MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Tải ảnh lên thất bại.");
        }
        const data = await res.json();
        uploadedUrls.push(data.url);
        setCompleted((count) => count + 1);
      }

      onChange(multiple ? uploadedUrls : uploadedUrls[0]);
      event.target.value = "";
    } catch (uploadError) {
      setError(uploadError.message || "Tải ảnh lên thất bại, thử lại nhé.");
    } finally {
      setUploading(false);
    }
  }

  const previewUrls = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div>
      <label className="label">{label}</label>
      {showPreview && previewUrls.length > 0 && (
        <div className="mb-3 grid max-w-xs grid-cols-3 gap-2">
          {previewUrls.slice(0, 6).map((url) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-frame border border-border bg-surfaceLight"
            >
              <Image
                src={url}
                alt="preview"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={handleFile}
        disabled={uploading}
        className="text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-frame file:border file:border-border file:bg-surface file:px-4 file:py-2 file:font-medium file:text-cream hover:file:border-gold hover:file:text-gold disabled:opacity-60"
      />
      <p className="mt-1 text-xs text-muted">
        JPG, PNG hoặc WebP. Tối đa 8MB mỗi ảnh.
      </p>
      {uploading && (
        <p className="mt-1 text-xs text-gold">
          {total > 1
            ? `Đang tải lên ${completed}/${total} ảnh...`
            : "Đang tải lên..."}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-rose">{error}</p>}
    </div>
  );
}
