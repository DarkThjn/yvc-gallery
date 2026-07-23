import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req, { params }) {
  const album = await prisma.album.findUnique({
    where: { id: params.id },
    include: { photos: true }
  });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(album);
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl || null;
  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  if (body.eventId !== undefined) data.eventId = body.eventId || null;

  const album = await prisma.album.update({ where: { id: params.id }, data });
  return NextResponse.json(album);
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.album.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
