import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBirthdayBannerData } from "@/lib/birthday";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    activeMembers,
    alumniMembers,
    albumCount,
    photoCount,
    eventCount,
    postCount,
    newSubmissions,
    contactedSubmissions,
    acceptedSubmissions,
    latestAlbum,
    latestPost,
    banner,
  ] = await Promise.all([
    prisma.member.count({ where: { isActive: true, isAlumni: false } }),
    prisma.member.count({ where: { isAlumni: true } }),
    prisma.album.count(),
    prisma.photo.count(),
    prisma.event.count(),
    prisma.post.count(),
    prisma.recruitmentSubmission.count({ where: { status: "new" } }),
    prisma.recruitmentSubmission.count({ where: { status: "contacted" } }),
    prisma.recruitmentSubmission.count({ where: { status: "accepted" } }),
    prisma.album.findFirst({
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true, publishedAt: true },
    }),
    getBirthdayBannerData(),
  ]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="plaque-label mb-2">CLB.Admin</p>
          <h1 className="text-3xl">Tổng quan vận hành</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/gallery/new" className="btn-gold">
            + Album
          </Link>
          <Link href="/admin/members/new" className="btn-outline">
            + Thành viên
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Thành viên hiện tại"
          value={activeMembers}
          href="/admin/members"
        />
        <StatCard
          label="Cựu thành viên"
          value={alumniMembers}
          href="/admin/members"
        />
        <StatCard label="Album" value={albumCount} href="/admin/gallery" />
        <StatCard label="Ảnh đã lưu" value={photoCount} href="/admin/gallery" />
        <StatCard label="Sự kiện" value={eventCount} href="/admin/events" />
        <StatCard label="Bài viết" value={postCount} href="/admin/blog" />
        <StatCard
          label="Đơn mới"
          value={newSubmissions}
          href="/admin/recruitment"
          highlight
        />
        <StatCard
          label="Đã liên hệ"
          value={contactedSubmissions}
          href="/admin/recruitment"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="frame p-6 lg:col-span-2">
          <p className="plaque-label mb-2">Banner sinh nhật</p>
          {banner.mode === "today" ? (
            <p className="text-cream">
              Hôm nay đang hiển thị:{" "}
              {banner.members.map((member) => member.fullName).join(", ")}
            </p>
          ) : (
            <p className="text-muted">
              Không có sinh nhật hôm nay. Banner đang hiển thị{" "}
              {banner.members.length} thành viên có sinh nhật trong tháng.
            </p>
          )}
          <p className="mt-3 text-xs text-muted">
            Banner tự cập nhật theo ngày sinh trong hồ sơ thành viên, không cần
            chỉnh tay.
          </p>
        </div>

        <div className="frame p-6">
          <p className="plaque-label mb-2">Tuyển thành viên</p>
          <p className="mb-2 font-display text-3xl text-gold">
            {acceptedSubmissions}
          </p>
          <p className="mb-4 text-sm text-muted">
            Đơn đã nhận và chuyển thành hồ sơ thành viên.
          </p>
          <Link
            href="/admin/recruitment"
            className="text-sm text-gold underline"
          >
            Xem đơn ứng tuyển →
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <RecentCard
          title="Album mới nhất"
          empty="Chưa có album nào."
          value={latestAlbum?.title}
          href={latestAlbum ? `/gallery/${latestAlbum.slug}` : "/admin/gallery"}
        />
        <RecentCard
          title="Bài viết mới nhất"
          empty="Chưa có bài viết nào."
          value={latestPost?.title}
          href={latestPost ? `/blog/${latestPost.slug}` : "/admin/blog"}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, href, highlight = false }) {
  return (
    <Link href={href} className="frame block p-5 transition hover:border-gold">
      <p className="plaque-label mb-2">{label}</p>
      <p
        className={`font-display text-3xl ${highlight ? "text-gold" : "text-cream"}`}
      >
        {value}
      </p>
    </Link>
  );
}

function RecentCard({ title, empty, value, href }) {
  return (
    <div className="frame p-6">
      <p className="plaque-label mb-2">{title}</p>
      <p className="mb-4 text-cream">{value || empty}</p>
      <Link href={href} className="text-sm text-gold underline">
        Mở nhanh →
      </Link>
    </div>
  );
}
