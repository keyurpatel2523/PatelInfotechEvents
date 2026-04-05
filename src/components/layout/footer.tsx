import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Services: [
    { label: "Catering",     href: "/services?cat=catering" },
    { label: "Photography",  href: "/services?cat=photography" },
    { label: "Venues",       href: "/services?cat=venue" },
    { label: "DJ & Music",   href: "/services?cat=dj" },
  ],
  Company: [
    { label: "About",        href: "/about" },
    { label: "Blog",         href: "/blog" },
    { label: "Careers",      href: "/careers" },
    { label: "Press",        href: "/press" },
  ],
  Platform: [
    { label: "Pricing",      href: "/pricing" },
    { label: "For Vendors",  href: "/vendors" },
    { label: "Dashboard",    href: "/dashboard" },
    { label: "API Docs",     href: "/docs/api" },
  ],
  Legal: [
    { label: "Privacy",      href: "/privacy" },
    { label: "Terms",        href: "/terms" },
    { label: "Cookies",      href: "/cookies" },
    { label: "Security",     href: "/security" },
  ],
};

const SOCIAL = [
  { label: "X / Twitter", href: "#", symbol: "𝕏" },
  { label: "Instagram",   href: "#", symbol: "◎" },
  { label: "LinkedIn",    href: "#", symbol: "in" },
  { label: "TikTok",      href: "#", symbol: "♪" },
];

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--bg-subtle]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-14 grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-base text-[--text-1]">
                Event<span className="gradient-text">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-[--text-3] max-w-xs leading-relaxed mb-6">
              London&apos;s premium multi-vendor event services marketplace. Discover, book, and host extraordinary experiences — all in one place.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {SOCIAL.map(({ symbol, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[--border] text-xs font-bold text-[--text-3] hover:text-[--text-1] hover:border-[--text-3] hover:bg-[--bg-muted] transition-all duration-150"
                >
                  {symbol}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[--text-4] mb-4">
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[--text-3] hover:text-[--text-1] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[--text-4]">
            © {new Date().getFullYear()} EventSphere by Patel Infotec Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[--text-4]">
              Made with care in London 🇬🇧
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
