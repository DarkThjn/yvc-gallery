import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { fullName: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const member = await prisma.member.create({
    data: {
      fullName: body.fullName,
      role: body.role || null,
      bio: body.bio || null,
      photoUrl: body.photoUrl || null,
      birthDate: new Date(body.birthDate),
      joinedAt: body.joinedAt ? new Date(body.joinedAt) : new Date(),
      isActive: body.isActive ?? true,
      isAlumni: body.isAlumni ?? false,
      facebookUrl: body.facebookUrl || null
    }
  });
  return NextResponse.json(member, { status: 201 });
}
