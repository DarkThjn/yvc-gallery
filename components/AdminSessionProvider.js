"use client";

import { SessionProvider } from "next-auth/react";
import AdminSessionGuard from "./AdminSessionGuard";

export default function AdminSessionProvider({ children }) {
  return (
    <SessionProvider refetchInterval={10} refetchOnWindowFocus>
      <AdminSessionGuard />
      {children}
    </SessionProvider>
  );
}
