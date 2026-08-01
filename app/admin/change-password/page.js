"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    let response;
    let result;
    try {
      response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      result = await response.json().catch(() => ({}));
    } catch {
      setLoading(false);
      setError("Không thể kết nối. Vui lòng thử lại.");
      return;
    }

    if (!response.ok) {
      setLoading(false);
      setError(result.error || "Không thể đổi mật khẩu. Vui lòng thử lại.");
      if (response.status === 401) {
        void signOut({ callbackUrl: "/admin/login?reason=session-replaced" });
      }
      return;
    }

    await signOut({ callbackUrl: "/admin/login?passwordChanged=1" });
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="plaque-label mb-3">Bảo mật tài khoản</p>
      <h1 className="mb-3 text-3xl">Đổi mật khẩu</h1>
      <p className="mb-8 text-sm text-muted">
        Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại.
      </p>

      <form onSubmit={handleSubmit} className="frame space-y-5 p-6">
        <div>
          <label className="label">Mật khẩu hiện tại</label>
          <input
            required
            type="password"
            autoComplete="current-password"
            className="input"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div>
          <label className="label">Mật khẩu mới</label>
          <input
            required
            minLength={12}
            maxLength={72}
            type="password"
            autoComplete="new-password"
            className="input"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <p className="mt-2 text-xs text-muted">Từ 12 đến 72 ký tự.</p>
        </div>
        <div>
          <label className="label">Nhập lại mật khẩu mới</label>
          <input
            required
            minLength={12}
            maxLength={72}
            type="password"
            autoComplete="new-password"
            className="input"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {error && <p className="text-sm text-rose">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
