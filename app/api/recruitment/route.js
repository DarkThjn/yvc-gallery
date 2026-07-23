import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyRecruitmentSubmission } from "@/lib/notifications";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Công khai: bất kỳ ai cũng gửi được đơn ứng tuyển
export async function POST(req) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`recruitment:${ip}`, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Bạn gửi hơi nhanh, vui lòng thử lại sau vài phút." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const { fullName, email, phone, studentInfo, birthDate, reason } = body;

  if (!fullName || !email || !birthDate || !reason) {
    return NextResponse.json(
      { error: "Thiếu thông tin bắt buộc" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
  }

  if (reason.trim().length < 10) {
    return NextResponse.json(
      { error: "Lý do ứng tuyển cần dài hơn một chút." },
      { status: 400 },
    );
  }

  const submission = await prisma.recruitmentSubmission.create({
    data: {
      fullName,
      email,
      phone,
      studentInfo,
      birthDate: new Date(birthDate),
      reason,
    },
  });

  await notifyRecruitmentSubmission(submission);

  return NextResponse.json(submission, { status: 201 });
}

// Chỉ admin mới xem được danh sách đơn ứng tuyển
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submissions = await prisma.recruitmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}
