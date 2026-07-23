import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.photo.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
