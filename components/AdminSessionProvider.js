"use client";

import { SessionProvider } from "next-auth/react";
import AdminSessionGuard from "./AdminSessionGuard";

export default function AdminSessionProvider({ children, session }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <AdminSessionGuard />
      {children}
    </SessionProvider>
  );
}
