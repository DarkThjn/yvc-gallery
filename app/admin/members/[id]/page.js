import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MemberForm from "@/components/admin/MemberForm";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({ params }) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  return (
    <div>
      <h1 className="text-2xl mb-8">Sửa thành viên</h1>
      <MemberForm member={member} />
    </div>
  );
}
