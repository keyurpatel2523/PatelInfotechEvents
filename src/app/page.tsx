"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Star, Shield, Search, CalendarCheck,
  PartyPopper, CheckCircle2, ChevronRight, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { HeroSearch } from "@/components/home/hero-search";
import { CategoryCard } from "@/components/home/category-card";
import type { CategoryCardData } from "@/components/home/category-card";
import { TestimonialCard } from "@/components/home/testimonial-card";
import type { TestimonialData } from "@/components/home/testimonial-card";
import { ServiceCard } from "@/components/marketplace/service-card";
import { MOCK_SERVICES } from "@/lib/mock-services";

/* ─── Data ────────────────────────────────────────────────── */
const CATEGORIES: CategoryCardData[] = [
  { id: "catering",    label: "Catering",        emoji: "🍽️", count: "120+ vendors", bg: "#fef3c7", accent: "#f59e0b", href: "/services?cat=catering" },
  { id: "photography", label: "Photography",      emoji: "📸", count: "85+ vendors",  bg: "#eef2ff", accent: "#6366f1", href: "/services?cat=photography" },
  { id: "dj",          label: "DJ & Music",       emoji: "🎵", count: "60+ vendors",  bg: "#f5f3ff", accent: "#8b5cf6", href: "/services?cat=dj" },
  { id: "venue",       label: "Venues",           emoji: "🏛️", count: "45+ venues",   bg: "#e0f2fe", accent: "#0ea5e9", href: "/services?cat=venue" },
  { id: "decor",       label: "Décor & Floral",   emoji: "🌸", count: "70+ vendors",  bg: "#fce7f3", accent: "#ec4899", href: "/services?cat=decor" },
  { id: "wedding",     label: "Wedding",          emoji: "💍", count: "95+ vendors",  bg: "#fee2e2", accent: "#ef4444", href: "/services?cat=wedding" },
  { id: "av",          label: "AV & Lighting",    emoji: "💡", count: "50+ vendors",  bg: "#dcfce7", accent: "#22c55e", href: "/services?cat=av" },
  { id: "kids",        label: "Kids & Family",    emoji: "🎈", count: "35+ vendors",  bg: "#ffedd5", accent: "#f97316", href: "/services?cat=kids" },
];

const STATS = [
  { value: "12,000+", label: "Events hosted",    suffix: "" },
  { value: "850+",    label: "Verified vendors", suffix: "" },
  { value: "2.4M+",   label: "Happy attendees",  suffix: "" },
  { value: "4.9",     label: "Average rating",   suffix: "★" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Browse services",
    description: "Search from 850+ vetted vendors across London. Filter by category, area, and budget.",
    color: "text-[#6366f1]",
    bg: "bg-[#eef2ff]",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Book instantly",
    description: "Send an enquiry or book immediately. No back-and-forth — confirm in minutes.",
    color: "text-[#8b5cf6]",
    bg: "bg-[#f5f3ff]",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Enjoy your event",
    description: "Your vendor arrives prepared. We handle the logistics so you can enjoy the moment.",
    color: "text-[#22c55e]",
    bg: "bg-[#f0fdf4]",
  },
];

const TESTIMONIALS: TestimonialData[] = [
  {
    name: "Sarah Mitchell",
    role: "Bride",
    location: "Kensington, London",
    rating: 5,
    event: "Wedding at The Grand Marquee",
    text: "EventSphere made planning our wedding completely stress-free. We found our caterer, photographer, and florist all in one place — every vendor was truly exceptional.",
    initials: "SM",
    avatarColor: "#6366f1",
  },
  {
    name: "James Hartley",
    role: "Corporate Event Manager",
    location: "Canary Wharf, London",
    rating: 5,
    event: "Annual Company Gala — 400 guests",
    text: "We've used EventSphere for three consecutive company galas. The quality of vendors and the booking process is unmatched. Our leadership team is always thoroughly impressed.",
    initials: "JH",
    avatarColor: "#8b5cf6",
  },
  {
    name: "Emma Thompson",
    role: "Marketing Director",
    location: "Shoreditch, London",
    rating: 5,
    event: "Brand Launch Event — Tech Startup",
    text: "From the AV team to the catering, every vendor we found through EventSphere delivered beyond expectations. The curation is genuinely world-class.",
    initials: "ET",
    avatarColor: "#22c55e",
  },
];

const TRUST_BADGES = [
  { icon: CheckCircle2, text: "Verified vendors only" },
  { icon: Shield,       text: "Secure payments" },
  { icon: Star,         text: "4.9★ rated platform" },
];

/* ─── Micro-components ────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[--border] bg-[--bg-subtle] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[--text-3]">
      {children}
    </span>
  );
}

function ConnectorLine({ className }: { className?: string }) {
  return (
    <div
      className={`hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px border-t-2 border-dashed border-[--border] ${className}`}
    />
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)" }}>
      <Navbar hero />

      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85"
            alt="Elegant London event"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark gradient overlay — stronger at bottom for search bar readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
          {/* Subtle brand tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-violet-950/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              London&apos;s #1 Event Services Marketplace
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08] mb-6"
          >
            Find the perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300">
              services for your event
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-10 max-w-xl text-lg text-white/75 leading-relaxed"
          >
            Catering, DJs, venues, decorations and more — all in one place.
            <br className="hidden sm:block" />
            Every vendor vetted. Every booking protected.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <HeroSearch className="w-full max-w-4xl" />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-3">
              <AvatarGroup count={2400}>
                {["SM", "JH", "ET", "OB"].map((l) => (
                  <Avatar key={l} size="sm">
                    <AvatarFallback className="text-[10px] font-bold bg-indigo-500 text-white">
                      {l}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className="text-sm text-white/70">
                <span className="font-semibold text-white">2,400+</span> joined this week
              </span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
              <span className="ml-1 text-sm font-semibold text-white">4.9 / 5</span>
              <span className="text-xs text-white/50 ml-1">(12,000+ reviews)</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-2 w-1 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section className="border-y py-10" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-4">
            {STATS.map(({ value, label, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex flex-col items-center gap-1 text-center"
              >
                <p className="text-3xl font-bold tabular-nums tracking-tight text-[--text-1]">
                  {value}
                  {suffix && <span className="text-amber-500 ml-0.5">{suffix}</span>}
                </p>
                <p className="text-sm text-[--text-4]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. CATEGORY GRID
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col items-center gap-4 text-center"
          >
            <SectionLabel>Browse by category</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-[--text-1] sm:text-4xl">
              What are you looking for?
            </h2>
            <p className="max-w-md text-[--text-3]">
              From intimate dinners to spectacular corporate galas — we have every service covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. FEATURED SERVICES
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-subtle)" }}>
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div className="flex flex-col gap-3">
              <SectionLabel>
                <Sparkles className="h-3 w-3" /> Featured services
              </SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight text-[--text-1] sm:text-4xl">
                Top-rated in London
              </h2>
              <p className="max-w-md text-[--text-3]">
                Handpicked vendors with exceptional reviews, verified credentials, and proven track records.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0 self-start sm:self-auto">
              <Link href="/services">
                View all services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </motion.div>

          {/* Service cards grid — reuse existing component */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_SERVICES.slice(0, 3).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceCard service={service} variant="grid" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 flex flex-col items-center gap-4 text-center"
          >
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-[--text-1] sm:text-4xl">
              Book your perfect vendor in minutes
            </h2>
            <p className="max-w-md text-[--text-3]">
              No calls, no confusion. Browse, enquire, and confirm — all from one place.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector (desktop only, between steps) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <ConnectorLine />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4"
                >
                  {/* Step number + icon */}
                  <div className="relative">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg}`}>
                      <step.icon className={`h-7 w-7 ${step.color}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[--text-1] text-[--bg] text-[10px] font-bold">
                      {i + 1}
                    </span>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-[--text-1] mb-2">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[--text-3]">{step.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-subtle)" }}>
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col items-center gap-4 text-center"
          >
            <SectionLabel>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              Reviews
            </SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight text-[--text-1] sm:text-4xl">
              Trusted by thousands across London
            </h2>
            <p className="max-w-md text-[--text-3]">
              Real stories from clients who found their perfect vendors on EventSphere.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} />
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
          >
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-[--text-3]">
                <Icon className="h-4 w-4 text-[#6366f1]" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. CTA SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=80"
                alt="Event planning"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-violet-900/80 to-purple-900/85" />
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            </div>

            {/* Glow orbs */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            {/* Content */}
            <div className="relative px-8 py-20 text-center sm:px-16 sm:py-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Badge className="mb-6 border-white/30 bg-white/10 text-white px-4 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Free to get started
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-4 text-4xl font-bold text-white sm:text-5xl leading-tight"
              >
                Start planning your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                  perfect event today
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-10 max-w-lg text-lg text-white/75 leading-relaxed"
              >
                Join 850+ verified vendors and thousands of London event planners.
                Every booking is protected, every vendor is vetted.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Button
                  size="xl"
                  className="bg-white text-[#4338ca] hover:bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.25)] font-semibold"
                  asChild
                >
                  <Link href="/services">
                    Browse Services <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white hover:bg-white/15 border border-white/30 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/dashboard">List your service</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
