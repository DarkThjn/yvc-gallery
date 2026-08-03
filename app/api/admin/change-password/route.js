import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/requireAdmin";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Vui lòng nhập đầy đủ mật khẩu." }, { status: 400 });
  }
  if (newPassword.length < 12) {
    return NextResponse.json({ error: "Mật khẩu mới cần có ít nhất 12 ký tự." }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "Mật khẩu mới phải khác mật khẩu hiện tại." }, { status: 400 });
  }
  if (Buffer.byteLength(currentPassword, "utf8") > 72 || Buffer.byteLength(newPassword, "utf8") > 72) {
    return NextResponse.json({ error: "Mật khẩu không được vượt quá 72 byte." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true }
  });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: "Mật khẩu hiện tại không đúng." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated = await prisma.adminUser.updateMany({
    where: {
      id: session.user.id,
      activeSessionId: session.user.sessionId
    },
    data: { passwordHash, activeSessionId: null, activeSessionSeenAt: null }
  });

  if (updated.count !== 1) {
    return NextResponse.json({ error: "Phiên đăng nhập đã hết hiệu lực." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
