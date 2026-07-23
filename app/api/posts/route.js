import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const slug = await uniqueSlug(body.title);

  const post = await prisma.post.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt || null,
      content: body.content,
      coverUrl: body.coverUrl || null,
      isPublished: body.isPublished ?? true
    }
  });
  return NextResponse.json(post, { status: 201 });
}

async function uniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}
