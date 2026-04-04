import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Product: [
    { label: "Events",   href: "/events" },
    { label: "Vendors",  href: "/vendors" },
    { label: "Pricing",  href: "/pricing" },
    { label: "Changelog",href: "/changelog" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Blog",    href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press",   href: "/press" },
  ],
  Developers: [
    { label: "API Docs",  href: "/docs/api" },
    { label: "SDK",       href: "/docs/sdk" },
    { label: "Webhooks",  href: "/docs/webhooks" },
    { label: "Status",    href: "/status" },
  ],
  Legal: [
    { label: "Privacy",  href: "/privacy" },
    { label: "Terms",    href: "/terms" },
    { label: "Cookies",  href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
};

const SOCIAL = [
  { label: "X / Twitter", href: "#", symbol: "𝕏" },
  { label: "GitHub",      href: "#", symbol: "⌥" },
  { label: "LinkedIn",    href: "#", symbol: "in" },
  { label: "Instagram",   href: "#", symbol: "◎" },
];

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--bg-subtle]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-12 grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-base text-[--text-1]">
                Event<span className="gradient-text">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-[--text-3] max-w-xs leading-relaxed">
              The premium multi-vendor marketplace for event professionals. Discover, book, and host extraordinary experiences.
            </p>
            {/* Social */}
            <div className="flex gap-2 mt-6">
              {SOCIAL.map(({ symbol, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[--border] text-xs font-bold text-[--text-3] hover:text-[--text-1] hover:border-[--text-3] transition-all duration-150"
                >
                  {symbol}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[--text-3] mb-3">
                {title}
              </p>
              <ul className="space-y-2">
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
            © {new Date().getFullYear()} EventSphere by Patel Infotec. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[--text-4]">
              Crafted with precision in India 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
