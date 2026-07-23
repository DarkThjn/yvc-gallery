import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Bài viết không tồn tại" };

  const description =
    post.excerpt ||
    post.content.slice(0, 150) ||
    `Bài viết mới từ ${siteConfig.shortName}.`;
  const imageUrl = post.coverUrl || absoluteUrl("/og.png");

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PostDetailPage({ params }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <p className="plaque-label mb-3">
        {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
      </p>
      <h1 className="text-3xl mb-8">{post.title}</h1>

      {post.coverUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-frame mb-8 frame">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="768px"
          />
        </div>
      )}

      <div className="text-cream/90 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
