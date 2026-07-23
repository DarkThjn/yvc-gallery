import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req, { params }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.excerpt !== undefined) data.excerpt = body.excerpt || null;
  if (body.content !== undefined) data.content = body.content;
  if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl || null;
  if (body.isPublished !== undefined) data.isPublished = body.isPublished;

  const post = await prisma.post.update({ where: { id: params.id }, data });
  return NextResponse.json(post);
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
