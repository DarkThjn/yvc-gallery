"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reason") === "session-replaced") {
      setNotice("Tài khoản vừa được đăng nhập ở thiết bị khác nên phiên này đã kết thúc.");
    } else if (params.get("passwordChanged") === "1") {
      setNotice("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (res?.error) {
      setError("Tên đăng nhập/email hoặc mật khẩu không đúng.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <p className="plaque-label mb-3 text-center">Khu vực quản trị</p>
      <h1 className="text-2xl mb-8 text-center">Đăng nhập</h1>

      {notice && (
        <p className="mb-5 rounded border border-gold/30 bg-gold/10 p-3 text-sm text-goldSoft">
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} className="frame p-6 space-y-5">
        <div>
          <label className="label">Tên đăng nhập hoặc email</label>
          <input
            required
            type="text"
            autoComplete="username"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Mật khẩu</label>
          <input
            required
            type="password"
            autoComplete="current-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-rose text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
