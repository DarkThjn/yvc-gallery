import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Bài viết ({posts.length})</h1>
        <Link href="/admin/blog/new" className="btn-gold">+ Viết bài mới</Link>
      </div>

      <div className="frame divide-y divide-border">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-cream">
                {p.title} {!p.isPublished && <span className="text-xs text-muted">(nháp)</span>}
              </p>
              <p className="text-xs text-muted">{new Date(p.publishedAt).toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/blog/${p.id}`} className="text-gold hover:text-goldSoft">Sửa</Link>
              <DeleteButton endpoint={`/api/posts/${p.id}`} />
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="px-5 py-8 text-muted">Chưa có bài viết nào.</p>}
      </div>
    </div>
  );
}
