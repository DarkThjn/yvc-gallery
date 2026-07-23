"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAlbumPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", eventId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: form.eventId || null })
      });
      if (!res.ok) throw new Error("failed");
      const album = await res.json();
      router.push(`/admin/gallery/${album.id}`);
      router.refresh();
    } catch {
      setError("Tạo album thất bại.");
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl mb-8">Thêm album</h1>
      <form onSubmit={handleSubmit} className="frame p-6 space-y-5 max-w-xl">
        <div>
          <label className="label">Tên album *</label>
          <input required className="input" value={form.title} onChange={update("title")} />
        </div>
        <div>
          <label className="label">Mô tả</label>
          <textarea rows={3} className="input" value={form.description} onChange={update("description")} />
        </div>
        <div>
          <label className="label">Gắn với sự kiện (không bắt buộc)</label>
          <select className="input" value={form.eventId} onChange={update("eventId")}>
            <option value="">— Không —</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-rose text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? "Đang tạo..." : "Tạo album"}
        </button>
      </form>
    </div>
  );
}
