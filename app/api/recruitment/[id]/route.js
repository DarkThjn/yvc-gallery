import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const VALID_STATUSES = new Set(["new", "contacted", "accepted", "rejected"]);

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const status = body.status === "reviewing" ? "contacted" : body.status;

  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  const submission = await prisma.recruitmentSubmission.findUnique({
    where: { id: params.id }
  });

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const birthDate = body.birthDate ? new Date(body.birthDate) : submission.birthDate;

  if (status === "accepted") {
    if (!birthDate || Number.isNaN(birthDate.getTime())) {
      return NextResponse.json({ error: "Cần ngày sinh để tạo thành viên" }, { status: 400 });
    }

    if (submission.acceptedMemberId) {
      const updated = await prisma.recruitmentSubmission.update({
        where: { id: params.id },
        data: { status, birthDate }
      });
      return NextResponse.json(updated);
    }

    const contactLines = [
      `Email: ${submission.email}`,
      submission.phone ? `SĐT: ${submission.phone}` : null,
      submission.socialUrl
        ? `Facebook/Instagram: ${submission.socialUrl}`
        : null,
      submission.studentInfo ? `Thông tin học tập: ${submission.studentInfo}` : null,
      submission.departments.length > 0
        ? `Phòng ban đăng ký: ${submission.departments.join(", ")}`
        : null,
      "",
      "Lý do ứng tuyển:",
      submission.reason
    ].filter((line) => line !== null);

    const updated = await prisma.$transaction(async (tx) => {
      const member = await tx.member.create({
        data: {
          fullName: submission.fullName,
          role: "Thành viên",
          bio: contactLines.join("\n"),
          birthDate,
          facebookUrl: submission.socialUrl,
          isActive: true,
          isAlumni: false
        }
      });

      return tx.recruitmentSubmission.update({
        where: { id: params.id },
        data: {
          status,
          birthDate,
          acceptedMemberId: member.id
        }
      });
    });

    return NextResponse.json(updated);
  }

  const data = { status };
  if (body.birthDate) data.birthDate = birthDate;

  const updated = await prisma.recruitmentSubmission.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.recruitmentSubmission.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
