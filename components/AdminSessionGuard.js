"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const HEARTBEAT_INTERVAL_MS = 15_000;

export default function AdminSessionGuard() {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || signingOut) return;

    let stopped = false;

    async function heartbeat() {
      try {
        const response = await fetch("/api/admin/session/heartbeat", {
          method: "POST",
          cache: "no-store"
        });

        if (!stopped && (response.status === 401 || response.status === 409)) {
          setSigningOut(true);
          void signOut({ callbackUrl: "/admin/login?reason=session-replaced" });
        }
      } catch {
        // Keep the current admin session if the network blips.
      }
    }

    void heartbeat();
    const intervalId = window.setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    window.addEventListener("focus", heartbeat);
    document.addEventListener("visibilitychange", heartbeat);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", heartbeat);
      document.removeEventListener("visibilitychange", heartbeat);
    };
  }, [session?.user?.sessionId, signingOut, status]);

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
