import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req, { params }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.location !== undefined) data.location = body.location || null;
  if (body.startsAt !== undefined) data.startsAt = new Date(body.startsAt);
  if (body.endsAt !== undefined) data.endsAt = body.endsAt ? new Date(body.endsAt) : null;
  if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl || null;
  if (body.isPublished !== undefined) data.isPublished = body.isPublished;

  const event = await prisma.event.update({ where: { id: params.id }, data });
  return NextResponse.json(event);
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
