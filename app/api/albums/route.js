import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const albums = await prisma.album.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true, event: true }
  });
  return NextResponse.json(albums);
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const slug = await uniqueSlug(body.title);

  const album = await prisma.album.create({
    data: {
      title: body.title,
      slug,
      description: body.description || null,
      coverUrl: body.coverUrl || null,
      eventId: body.eventId || null
    }
  });
  return NextResponse.json(album, { status: 201 });
}

async function uniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (await prisma.album.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}
