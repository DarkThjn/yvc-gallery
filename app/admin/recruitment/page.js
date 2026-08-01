import { prisma } from "@/lib/prisma";
import RecruitmentStatusSelect from "@/components/admin/RecruitmentStatusSelect";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  new: "Mới",
  contacted: "Đã liên hệ",
  accepted: "Đã nhận",
  rejected: "Từ chối"
};

export default async function AdminRecruitmentPage() {
  const submissions = await prisma.recruitmentSubmission.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-2xl mb-8">Đơn ứng tuyển ({submissions.length})</h1>

      <div className="space-y-4">
        {submissions.map((s) => (
          <div key={s.id} className="frame p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-lg">{s.fullName}</p>
                <p className="text-sm text-muted">
                  {s.email} {s.phone ? `· ${s.phone}` : ""}
                </p>
                {s.studentInfo && <p className="text-sm text-muted">{s.studentInfo}</p>}
                {s.birthDate && (
                  <p className="text-sm text-muted">
                    Ngày sinh: {new Date(s.birthDate).toLocaleDateString("vi-VN")}
                  </p>
                )}
                {s.departments.length > 0 && (
                  <p className="mt-1 text-sm text-gold">
                    Phòng ban: {s.departments.join(", ")}
                  </p>
                )}
                {s.acceptedMemberId && (
                  <p className="text-xs text-gold mt-1">Đã tạo hồ sơ thành viên</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RecruitmentStatusSelect
                  id={s.id}
                  status={s.status}
                  labels={STATUS_LABEL}
                  birthDate={s.birthDate}
                />
                <DeleteButton endpoint={`/api/recruitment/${s.id}`} />
              </div>
            </div>
            <p className="text-cream/90 mt-3 text-sm whitespace-pre-line">{s.reason}</p>
            <p className="plaque-label mt-3">
              {new Date(s.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="frame p-6 text-muted">Chưa có đơn ứng tuyển nào.</p>
        )}
      </div>
    </div>
  );
}
