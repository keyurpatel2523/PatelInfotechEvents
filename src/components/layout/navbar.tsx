"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Bell, ChevronDown,
  Calendar, LayoutDashboard, LogOut,
  Settings, Star, Ticket, Zap, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Events",   href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Vendors",  href: "/vendors" },
  { label: "Pricing",  href: "/pricing" },
];

interface NavbarProps {
  /** When true, navbar renders with white text on a dark hero until scrolled */
  hero?: boolean;
}

export function Navbar({ hero = false }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* When on a hero page and not yet scrolled, use white text */
  const isLight = !hero || scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "glass border-b border-[--border] shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className={cn("font-bold text-base tracking-tight transition-colors", isLight ? "text-[--text-1]" : "text-white")}>
                Event<span className={isLight ? "gradient-text" : "text-violet-300"}>Sphere</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                    isLight
                      ? "text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1.5">
              {/* Search trigger */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden sm:flex", isLight ? "text-[--text-3]" : "text-white/70 hover:bg-white/10 hover:text-white")}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative hidden sm:flex", isLight ? "text-[--text-3]" : "text-white/70 hover:bg-white/10 hover:text-white")}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#6366f1]" />
              </Button>

              {/* Services shortcut */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={cn("hidden sm:flex", isLight ? "text-[--text-3]" : "text-white/70 hover:bg-white/10 hover:text-white")}
              >
                <Link href="/services">
                  <ShoppingBag className="h-4 w-4" />
                </Link>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "hidden md:flex items-center gap-2 rounded-xl px-2 py-1.5",
                      "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#6366f1]",
                      isLight ? "hover:bg-[--bg-muted]" : "hover:bg-white/10"
                    )}
                  >
                    <Avatar size="sm">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>KP</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className={cn("text-xs font-semibold leading-none", isLight ? "text-[--text-1]" : "text-white")}>
                        Keyur P.
                      </p>
                      <p className={cn("text-xs leading-none mt-0.5", isLight ? "text-[--text-3]" : "text-white/60")}>
                        Pro Plan
                      </p>
                    </div>
                    <ChevronDown className={cn("h-3.5 w-3.5", isLight ? "text-[--text-3]" : "text-white/50")} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-[--text-1]">Keyur Patel</p>
                      <p className="text-xs text-[--text-3]">keyur@patelinfotec.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LayoutDashboard className="h-4 w-4 text-[--text-3]" />
                    Dashboard
                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 text-[--text-3]" />
                    My Events
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Ticket className="h-4 w-4 text-[--text-3]" />
                    My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 text-[--text-3]" />
                    Saved
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 text-[--text-3]" />
                    Settings
                    <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem destructive>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CTA */}
              <Button
                size="sm"
                className={cn("hidden md:flex", !isLight && "bg-white text-[#4338ca] hover:bg-white/90")}
                asChild
              >
                <Link href="/services">Browse Services</Link>
              </Button>

              {/* Mobile toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", isLight ? "text-[--text-2]" : "text-white hover:bg-white/10")}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 md:hidden glass border-b border-[--border] px-4 py-4 shadow-[var(--shadow-lg)]"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-2 pt-3 border-t border-[--border]">
              <Button variant="outline" size="sm" className="flex-1">Sign in</Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
