"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

export default function PostForm({ post }) {
  const router = useRouter();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverUrl: post?.coverUrl || "",
    isPublished: post?.isPublished ?? true
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

    const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("failed");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Lưu thất bại.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="frame p-6 space-y-5 max-w-2xl">
      <ImageUploader value={form.coverUrl} onChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))} label="Ảnh bìa" />

      <div>
        <label className="label">Tiêu đề *</label>
        <input required className="input" value={form.title} onChange={update("title")} />
      </div>

      <div>
        <label className="label">Tóm tắt ngắn</label>
        <input className="input" value={form.excerpt} onChange={update("excerpt")} />
      </div>

      <div>
        <label className="label">Nội dung *</label>
        <textarea required rows={10} className="input" value={form.content} onChange={update("content")} />
      </div>

      <label className="flex items-center gap-2 text-sm text-cream">
        <input type="checkbox" checked={form.isPublished} onChange={update("isPublished")} />
        Công khai trên trang web
      </label>

      {error && <p className="text-rose text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Đăng bài"}
      </button>
    </form>
  );
}
