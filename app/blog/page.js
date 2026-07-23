import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tin tức" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">Tin tức</p>
      <h1 className="text-3xl mb-10">Bài viết &amp; thông báo</h1>

      <div className="space-y-5">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="frame p-6 block">
            <p className="plaque-label mb-2">
              {new Date(p.publishedAt).toLocaleDateString("vi-VN")}
            </p>
            <p className="font-display text-xl mb-2">{p.title}</p>
            {p.excerpt && <p className="text-muted">{p.excerpt}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted frame p-6">Chưa có bài viết nào.</p>}
      </div>
    </div>
  );
}
