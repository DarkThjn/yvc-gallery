import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req, { params }) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const data = {};
  if (body.fullName !== undefined) data.fullName = body.fullName;
  if (body.role !== undefined) data.role = body.role || null;
  if (body.bio !== undefined) data.bio = body.bio || null;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl || null;
  if (body.birthDate !== undefined) data.birthDate = new Date(body.birthDate);
  if (body.joinedAt !== undefined) data.joinedAt = new Date(body.joinedAt);
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.isAlumni !== undefined) data.isAlumni = body.isAlumni;
  if (body.facebookUrl !== undefined) data.facebookUrl = body.facebookUrl || null;

  const member = await prisma.member.update({ where: { id: params.id }, data });
  return NextResponse.json(member);
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.member.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
