import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { refreshAdminPresence } from "@/lib/adminPresence";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const sessionId = session?.user?.sessionId;

  if (!userId || !sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isActive = await refreshAdminPresence(userId, sessionId);
  if (!isActive) {
    return NextResponse.json({ error: "SessionReplaced" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
