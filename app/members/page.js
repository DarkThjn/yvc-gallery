import { prisma } from "@/lib/prisma";
import MemberDirectory from "@/components/MemberDirectory";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Thành viên",
  description: `Danh sách thành viên hiện tại và cựu thành viên của ${siteConfig.fullName}.`,
};
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    where: {
      OR: [{ isActive: true, isAlumni: false }, { isAlumni: true }],
    },
    orderBy: { fullName: "asc" },
  });

  const currentMembers = members
    .filter((member) => member.isActive && !member.isAlumni)
    .map(serializeMember);
  const alumniMembers = members
    .filter((member) => member.isAlumni)
    .map(serializeMember);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="plaque-label mb-3">Danh bạ</p>
      <h1 className="mb-10 text-3xl">Thành viên câu lạc bộ</h1>

      {members.length === 0 ? (
        <p className="frame p-6 text-muted">
          Chưa có thành viên nào trong hệ thống.
        </p>
      ) : (
        <MemberDirectory
          currentMembers={currentMembers}
          alumniMembers={alumniMembers}
        />
      )}
    </div>
  );
}

function serializeMember(member) {
  return {
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    photoUrl: member.photoUrl,
    joinedAt: member.joinedAt.toISOString(),
  };
}
