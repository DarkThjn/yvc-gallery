"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

const links = siteConfig.navigation;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-ink/95 backdrop-blur">
        <div className="relative mx-auto flex h-24 max-w-6xl items-center justify-between px-5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-cream transition hover:border-gold hover:text-gold xl:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
          >
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
            </span>
          </button>

          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center xl:static xl:translate-x-0"
            aria-label="YVC - về trang chủ"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/logo-yvc.png"
              alt="YVC"
              width={192}
              height={108}
              className="h-[72px] w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 text-sm xl:flex xl:gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-colors ${
                  pathname === l.href
                    ? "text-gold"
                    : "text-muted hover:text-gold"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Đóng menu"
          />

          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-r border-border bg-surface px-5 py-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="plaque-label">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-cream transition hover:border-gold hover:text-gold"
                aria-label="Đóng menu"
              >
                <span className="relative h-5 w-5" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                  <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                </span>
              </button>
            </div>

            <nav className="grid gap-2">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-frame border px-4 py-3 text-base font-medium transition ${
                      active
                        ? "border-gold bg-surfaceLight text-gold"
                        : "border-border text-cream hover:border-gold hover:text-gold"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
