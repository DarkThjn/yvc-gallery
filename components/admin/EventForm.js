"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

function toLocalInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ event }) {
  const router = useRouter();
  const isEdit = !!event;

  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    startsAt: toLocalInputValue(event?.startsAt) || "",
    endsAt: toLocalInputValue(event?.endsAt) || "",
    coverUrl: event?.coverUrl || "",
    isPublished: event?.isPublished ?? true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/events/${event.id}` : "/api/events";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, endsAt: form.endsAt || null })
      });
      if (!res.ok) throw new Error("failed");
      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Lưu thất bại.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="frame p-6 space-y-5 max-w-xl">
      <ImageUploader value={form.coverUrl} onChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))} label="Ảnh bìa" />

      <div>
        <label className="label">Tên sự kiện *</label>
        <input required className="input" value={form.title} onChange={update("title")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Bắt đầu *</label>
          <input required type="datetime-local" className="input" value={form.startsAt} onChange={update("startsAt")} />
        </div>
        <div>
          <label className="label">Kết thúc</label>
          <input type="datetime-local" className="input" value={form.endsAt} onChange={update("endsAt")} />
        </div>
      </div>

      <div>
        <label className="label">Địa điểm</label>
        <input className="input" value={form.location} onChange={update("location")} />
      </div>

      <div>
        <label className="label">Mô tả</label>
        <textarea rows={5} className="input" value={form.description} onChange={update("description")} />
      </div>

      <label className="flex items-center gap-2 text-sm text-cream">
        <input type="checkbox" checked={form.isPublished} onChange={update("isPublished")} />
        Công khai trên trang web
      </label>

      {error && <p className="text-rose text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sự kiện"}
      </button>
    </form>
  );
}
