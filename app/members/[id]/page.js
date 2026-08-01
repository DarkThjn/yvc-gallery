import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { getSocialPlatformLabel, normalizeFacebookUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) return { title: "Thành viên không tồn tại" };

  const title = `${member.fullName}${member.role ? ` - ${member.role}` : ""}`;
  const description =
    member.bio?.slice(0, 150) || `Hồ sơ thành viên của ${siteConfig.fullName}.`;
  const imageUrl = member.photoUrl || absoluteUrl("/og.png");

  return {
    title,
    description,
    alternates: { canonical: `/members/${member.id}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/members/${member.id}`),
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: member.fullName },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function MemberDetailPage({ params }) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  const birthDate = new Date(member.birthDate);
  const joinedAt = new Date(member.joinedAt);
  const facebookUrl = normalizeFacebookUrl(member.facebookUrl);
  const socialPlatformLabel = getSocialPlatformLabel(facebookUrl);

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="frame p-8 grid md:grid-cols-[220px_1fr] gap-8">
        <div className="relative w-full aspect-square overflow-hidden rounded-frame bg-surfaceLight">
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.fullName}
              fill
              className="object-cover"
              sizes="220px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-5xl text-gold/60">
                {member.fullName?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="plaque-label mb-2">{member.role || "Thành viên"}</p>
          <h1 className="text-3xl mb-4">{member.fullName}</h1>
          <p className="text-sm text-muted mb-1">
            Sinh nhật: {birthDate.getUTCDate()}/{birthDate.getUTCMonth() + 1}
          </p>
          <p className="text-sm text-muted mb-1">
            Ngày gia nhập: {joinedAt.toLocaleDateString("vi-VN")}
          </p>
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gold text-sm underline"
            >
              {socialPlatformLabel}
            </a>
          )}
          {member.bio && (
            <p className="mt-5 text-cream/90 leading-relaxed">{member.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
