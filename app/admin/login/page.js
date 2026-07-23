"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <p className="plaque-label mb-3 text-center">Khu vực quản trị</p>
      <h1 className="text-2xl mb-8 text-center">Đăng nhập</h1>

      <form onSubmit={handleSubmit} className="frame p-6 space-y-5">
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
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
