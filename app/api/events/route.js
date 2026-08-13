import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";
import { parseVietnamDateTimeInput } from "@/lib/vietnamTime";

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { startsAt: "desc" } });
  return NextResponse.json(events);
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const slug = await uniqueSlug(body.title);

  const event = await prisma.event.create({
    data: {
      title: body.title,
      slug,
      description: body.description || null,
      location: body.location || null,
      startsAt: parseVietnamDateTimeInput(body.startsAt),
      endsAt: parseVietnamDateTimeInput(body.endsAt),
      coverUrl: body.coverUrl || null,
      isPublished: body.isPublished ?? true
    }
  });
  return NextResponse.json(event, { status: 201 });
}

async function uniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}
