import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const galleryLinks = siteConfig.navigation.filter((link) =>
  ["/gallery", "/members", "/events", "/blog"].includes(link.href),
);

const clubLinks = siteConfig.navigation.filter((link) =>
  ["/about", "/recruitment", "/contact"].includes(link.href),
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-4"
            aria-label="YVC - về trang chủ"
          >
            <Image
              src="/logo-yvc.png"
              alt="YVC"
              width={160}
              height={90}
              className="h-16 w-auto"
            />
            <div>
              <p className="font-display text-xl text-cream">
                {siteConfig.name}
              </p>
              <p className="plaque-label mt-1">Since {siteConfig.since}</p>
            </div>
          </Link>

          <p className="mt-5 text-sm leading-6 text-muted">
            {siteConfig.description}
          </p>
        </div>

        <FooterColumn title="Khám phá" links={galleryLinks} />
        <FooterColumn title="Câu lạc bộ" links={clubLinks} />
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.fullName}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/recruitment"
              className="transition-colors hover:text-gold"
            >
              Gia nhập YVC
            </Link>
            <Link href="/contact" className="transition-colors hover:text-gold">
              Kết nối với CLB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <p className="plaque-label mb-4">{title}</p>
      <ul className="grid gap-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
