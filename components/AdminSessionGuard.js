"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function AdminSessionGuard() {
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (session?.error !== "SessionReplaced" || signingOut) return;

    setSigningOut(true);
    void signOut({ callbackUrl: "/admin/login?reason=session-replaced" });
  }, [session?.error, signingOut]);

  if (!signingOut) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/90 px-5 text-center">
      <div className="frame max-w-sm p-6">
        <p className="text-cream">Tài khoản đã được đăng nhập ở thiết bị khác.</p>
        <p className="mt-2 text-sm text-muted">Đang đăng xuất phiên này...</p>
      </div>
    </div>
  );
}
