"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function toDateInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${mm}-${dd}`;
}

export default function RecruitmentStatusSelect({ id, status, labels, birthDate }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status === "reviewing" ? "contacted" : status);
  const [memberBirthDate, setMemberBirthDate] = useState(toDateInputValue(birthDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    const nextStatus = e.target.value;
    setSelectedStatus(nextStatus);
    setError("");

    if (nextStatus === "accepted" && !memberBirthDate) {
      setError("Nhập ngày sinh trước khi chọn Đã nhận.");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/recruitment/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        birthDate: memberBirthDate || undefined
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Cập nhật thất bại.");
      setSaving(false);
      setSelectedStatus(status === "reviewing" ? "contacted" : status);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {!birthDate && (
        <input
          type="date"
          className="input !w-auto !py-1.5 text-sm"
          value={memberBirthDate}
          onChange={(e) => setMemberBirthDate(e.target.value)}
          aria-label="Ngày sinh để tạo thành viên"
        />
      )}
      <select
        value={selectedStatus}
        onChange={handleChange}
        disabled={saving}
        className="input !w-auto !py-1.5 text-sm"
      >
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <p className="max-w-48 text-right text-xs text-rose">{error}</p>}
    </div>
  );
}
