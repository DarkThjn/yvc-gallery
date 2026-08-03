import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { refreshAdminPresence } from "./adminPresence";
import { authOptions } from "./auth";

// Dùng trong các API route dạng: const denied = await requireAdmin(); if (denied) return denied;
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.sessionId) return null;

  const isActive = await refreshAdminPresence(session.user.id, session.user.sessionId);
  if (!isActive) return null;

  return session;
}
