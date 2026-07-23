import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Giới thiệu",
  description: `Giới thiệu về ${siteConfig.fullName}.`,
};

const values = [
  {
    title: "Lưu giữ kỷ niệm",
    body: "Mỗi album là một lát cắt của hoạt động CLB, từ buổi tập thường kỳ đến các sự kiện và dấu mốc đáng nhớ.",
  },
  {
    title: "Kết nối thành viên",
    body: "Website giúp thành viên hiện tại, cựu thành viên và những người yêu mến CLB dễ dàng theo dõi hành trình chung.",
  },
  {
    title: "Cởi mở với thế hệ mới",
    body: "Kênh tuyển thành viên giúp các bạn quan tâm gửi thông tin nhanh hơn, còn ban quản trị xử lý đơn gọn hơn.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="plaque-label mb-3">Giới thiệu</p>
      <h1 className="mb-5 max-w-3xl text-3xl">{siteConfig.fullName}</h1>
      <p className="mb-10 max-w-3xl text-muted">{siteConfig.description}</p>

      <div className="grid gap-5 md:grid-cols-3">
        {values.map((item) => (
          <article key={item.title} className="frame p-6">
            <p className="font-display text-xl text-cream">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="frame mt-10 p-7">
        <p className="plaque-label mb-3">Since {siteConfig.since}</p>
        <h2 className="mb-3 text-2xl">
          Một phòng trưng bày cho hành trình của CLB
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          YVC Gallery được xây dựng như nơi tổng hợp album, sự kiện, tin tức, hồ
          sơ thành viên và tuyển thành viên. Khi CLB có thêm nội dung chính thức
          về lịch sử, ban chủ nhiệm hoặc thành tích, phần giới thiệu này có thể
          mở rộng mà không ảnh hưởng tới các khu vực còn lại của website.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/gallery" className="btn-gold">
            Xem phòng trưng bày
          </Link>
          <Link href="/recruitment" className="btn-outline">
            Gia nhập YVC
          </Link>
        </div>
      </div>
    </div>
  );
}
