"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/members", label: "Thành viên" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/events", label: "Sự kiện" },
  { href: "/admin/blog", label: "Bài viết" },
  { href: "/admin/recruitment", label: "Đơn ứng tuyển" }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/admin" className="font-display text-lg text-cream">
          CLB<span className="text-gold">.</span>Admin
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "text-gold" : "text-muted hover:text-cream transition-colors"}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-muted hover:text-gold">
            Xem trang web →
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs text-muted hover:text-rose"
          >
            Đăng xuất
          </button>
        </div>
      </div>
      {/* nav rút gọn cho mobile */}
      <nav className="md:hidden flex gap-4 overflow-x-auto px-5 pb-3 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-muted whitespace-nowrap hover:text-gold">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
