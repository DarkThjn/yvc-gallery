"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ endpoint, label = "Xoá", confirmText = "Xoá mục này?" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      alert("Xoá thất bại, thử lại nhé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-muted hover:text-rose">
      {loading ? "Đang xoá..." : label}
    </button>
  );
}
