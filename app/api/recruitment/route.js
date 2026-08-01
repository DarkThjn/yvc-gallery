import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { notifyRecruitmentSubmission } from "@/lib/notifications";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { RECRUITMENT_DEPARTMENTS } from "@/lib/recruitmentDepartments";
import { normalizeSocialUrl } from "@/lib/urls";

const VALID_DEPARTMENTS = new Set(RECRUITMENT_DEPARTMENTS);

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
  const {
    fullName,
    email,
    phone,
    socialUrl,
    studentInfo,
    birthDate,
    departments,
    reason,
  } = body;

  if (!fullName || !email || !birthDate || !reason) {
    return NextResponse.json(
      { error: "Thiếu thông tin bắt buộc" },
      { status: 400 },
    );
  }

  if (
    !Array.isArray(departments) ||
    departments.length === 0 ||
    departments.some(
      (department) =>
        typeof department !== "string" || !VALID_DEPARTMENTS.has(department),
    )
  ) {
    return NextResponse.json(
      { error: "Vui lòng chọn ít nhất một phòng ban hợp lệ." },
      { status: 400 },
    );
  }

  const selectedDepartments = [...new Set(departments)];
  const normalizedSocialUrl = normalizeSocialUrl(socialUrl);
  const hasSocialUrl =
    typeof socialUrl === "string" && socialUrl.trim().length > 0;

  if (
    (socialUrl != null && typeof socialUrl !== "string") ||
    (hasSocialUrl && !normalizedSocialUrl)
  ) {
    return NextResponse.json(
      { error: "Link phải thuộc Facebook hoặc Instagram." },
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
      socialUrl: normalizedSocialUrl,
      studentInfo,
      birthDate: new Date(birthDate),
      departments: selectedDepartments,
      reason,
    },
  });

  await notifyRecruitmentSubmission(submission);

  return NextResponse.json(submission, { status: 201 });
}

// Chỉ admin mới xem được danh sách đơn ứng tuyển
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const submissions = await prisma.recruitmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}
