import Image from "next/image";
import Link from "next/link";
import BirthdayGlowFrame from "@/components/BirthdayGlowFrame";
import GalleryBendShowcase from "@/components/GalleryBendShowcase";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demo hiệu ứng showcase" };

export default async function EffectsDemoPage() {
  const [album, member] = await Promise.all([
    prisma.album.findFirst({
      where: { photos: { some: {} } },
      orderBy: { createdAt: "desc" },
      include: { photos: { orderBy: { createdAt: "asc" }, take: 8 } },
    }),
    prisma.member.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { fullName: true, role: true, photoUrl: true, birthDate: true },
    }),
  ]);

  const demoPhotos =
    album?.photos?.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
    })) || [];

  return (
    <div className="py-12">
      <div className="mx-auto mb-10 max-w-6xl px-5">
        <p className="plaque-label mb-3">YVC Experiments</p>
        <h1 className="mb-3 text-3xl">Demo hiệu ứng showcase</h1>
        <p className="max-w-2xl text-muted">
          Hai hướng thử nghiệm cho phòng trưng bày album và card chúc mừng sinh
          nhật.
        </p>
      </div>

      {demoPhotos.length > 0 ? (
        <GalleryBendShowcase
          compact
          albumTitle={album.title}
          albumDescription={album.description}
          backHref={`/gallery/${album.slug}/showcase`}
          backLabel="Mở showcase đầy đủ"
          photos={demoPhotos}
        />
      ) : (
        <div className="mx-auto max-w-6xl px-5">
          <p className="frame p-6 text-muted">Chưa có album nào có ảnh để demo showcase.</p>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="plaque-label mb-2">Birthday Frame</p>
            <h2 className="text-2xl">Card chúc mừng sinh nhật</h2>
          </div>
          <Link href="/" className="btn-outline">
            Xem trên trang chủ
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center">
          <BirthdayGlowFrame variant="spotlight">
            <div className="frame p-3 text-center">
              <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-frame bg-surfaceLight">
                {member?.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.fullName}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-5xl text-gold/60">
                      YVC
                    </span>
                  </div>
                )}
              </div>
              <p className="font-display text-xl text-cream">
                {member?.fullName || "YVC Member"}
              </p>
              <p className="text-sm text-muted">
                {member?.role || "Thành viên câu lạc bộ"}
              </p>
              <p className="plaque-label mt-3">Happy birthday</p>
            </div>
          </BirthdayGlowFrame>

          <div className="frame p-6">
            <p className="plaque-label mb-3">Pastel aura</p>
            <h3 className="mb-3 text-2xl">
              Viền glow mềm, ít chuyển động, hợp màu logo.
            </h3>
            <p className="text-muted">
              Demo này dùng CSS animation nhẹ để mô phỏng frame kiểu Flame Wrap.
              Khi chốt hướng visual, mình có thể thay bằng Canvas UI thật cho
              desktop hoặc giữ bản nhẹ này cho production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
