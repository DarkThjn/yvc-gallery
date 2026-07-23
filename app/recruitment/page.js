import { prisma } from "@/lib/prisma";
import RecruitmentForm from "@/components/RecruitmentForm";

export const metadata = { title: "Tuyển thành viên" };
export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const settings = await prisma.recruitmentSettings.findUnique({
    where: { id: "singleton" }
  });

  const isOpen = settings?.isOpen ?? true;
  const title = settings?.title || "Tuyển thành viên mới";
  const description =
    settings?.description ||
    "Câu lạc bộ luôn chào đón những thành viên mới nhiệt huyết. Điền thông tin bên dưới để đăng ký ứng tuyển.";

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Tuyển thành viên</p>
      <h1 className="text-3xl mb-4">{title}</h1>
      <p className="text-muted mb-10 whitespace-pre-line">{description}</p>

      {isOpen ? (
        <RecruitmentForm />
      ) : (
        <p className="frame p-6 text-muted">
          Đợt tuyển thành viên hiện đã đóng. Hãy theo dõi trang{" "}
          <a href="/blog" className="text-gold underline">Tin tức</a> để không bỏ lỡ đợt tiếp theo!
        </p>
      )}
    </div>
  );
}
