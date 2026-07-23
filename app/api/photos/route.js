import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  if (!body.albumId || !body.url) {
    return NextResponse.json({ error: "Thiếu albumId hoặc url" }, { status: 400 });
  }

  const photo = await prisma.photo.create({
    data: { albumId: body.albumId, url: body.url, caption: body.caption || null }
  });
  return NextResponse.json(photo, { status: 201 });
}
