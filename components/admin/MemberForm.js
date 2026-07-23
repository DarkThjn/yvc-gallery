"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

function toDateInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  // năm không quan trọng cho banner, nhưng vẫn lưu để hiển thị nếu cần
  return `${d.getUTCFullYear()}-${mm}-${dd}`;
}

function todayInputValue() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

export default function MemberForm({ member }) {
  const router = useRouter();
  const isEdit = !!member;

  const [form, setForm] = useState({
    fullName: member?.fullName || "",
    role: member?.role || "",
    bio: member?.bio || "",
    photoUrl: member?.photoUrl || "",
    birthDate: toDateInputValue(member?.birthDate) || "",
    joinedAt: toDateInputValue(member?.joinedAt) || todayInputValue(),
    facebookUrl: member?.facebookUrl || "",
    isActive: member?.isActive ?? true,
    isAlumni: member?.isAlumni ?? false
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

    const url = isEdit ? `/api/members/${member.id}` : "/api/members";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("failed");
      router.push("/admin/members");
      router.refresh();
    } catch {
      setError("Lưu thất bại, kiểm tra lại thông tin.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="frame p-6 space-y-5 max-w-xl">
      <ImageUploader value={form.photoUrl} onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))} label="Ảnh đại diện" />

      <div>
        <label className="label">Họ và tên *</label>
        <input required className="input" value={form.fullName} onChange={update("fullName")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Vai trò</label>
          <input className="input" placeholder="Thành viên, Chủ nhiệm..." value={form.role} onChange={update("role")} />
        </div>
        <div>
          <label className="label">Ngày sinh *</label>
          <input required type="date" className="input" value={form.birthDate} onChange={update("birthDate")} />
        </div>
      </div>

      <div>
        <label className="label">Ngày gia nhập *</label>
        <input required type="date" className="input" value={form.joinedAt} onChange={update("joinedAt")} />
      </div>

      <div>
        <label className="label">Facebook</label>
        <input className="input" value={form.facebookUrl} onChange={update("facebookUrl")} />
      </div>

      <div>
        <label className="label">Tiểu sử ngắn</label>
        <textarea rows={4} className="input" value={form.bio} onChange={update("bio")} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-cream">
          <input type="checkbox" checked={form.isActive} onChange={update("isActive")} />
          Đang hoạt động
        </label>
        <label className="flex items-center gap-2 text-sm text-cream">
          <input type="checkbox" checked={form.isAlumni} onChange={update("isAlumni")} />
          Cựu thành viên
        </label>
      </div>

      {error && <p className="text-rose text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm thành viên"}
      </button>
    </form>
  );
}
