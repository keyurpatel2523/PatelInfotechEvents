"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Bell, ChevronDown,
  Calendar, LayoutDashboard, LogOut,
  Settings, Star, Ticket, Zap,
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
  { label: "Events", href: "/events" },
  { label: "Vendors", href: "/vendors" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-300",
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
              <span className="font-bold text-base tracking-tight text-[--text-1]">
                Event<span className="gradient-text">Sphere</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-medium text-[--text-2]",
                    "hover:bg-[--bg-muted] hover:text-[--text-1]",
                    "transition-all duration-150"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <Button variant="ghost" size="icon" className="hidden sm:flex text-[--text-3]">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hidden sm:flex text-[--text-3]">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "hidden md:flex items-center gap-2 rounded-xl px-2 py-1",
                    "hover:bg-[--bg-muted] transition-colors duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  )}>
                    <Avatar size="sm">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>KP</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[--text-1] leading-none">Keyur P.</p>
                      <p className="text-xs text-[--text-3] leading-none mt-0.5">Pro Plan</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-[--text-3]" />
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
              <Button size="sm" className="hidden md:flex">
                Host an Event
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[--text-2]"
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
            className={cn(
              "fixed inset-x-0 top-16 z-30 md:hidden",
              "glass border-b border-[--border]",
              "px-4 py-4 shadow-[var(--shadow-lg)]"
            )}
          >
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5",
                    "text-sm font-medium text-[--text-2]",
                    "hover:bg-[--bg-muted] hover:text-[--text-1]",
                    "transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-2 pt-2 border-t border-[--border]">
              <Button variant="outline" size="sm" className="flex-1">Sign in</Button>
              <Button size="sm" className="flex-1">Host an Event</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
