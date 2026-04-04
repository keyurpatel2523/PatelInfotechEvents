"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Star, Shield, Zap, TrendingUp,
  Calendar, Users, Globe, ChevronRight, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { SearchBar } from "@/components/marketplace/search-bar";
import { EventCard } from "@/components/marketplace/event-card";
import { VendorCard } from "@/components/marketplace/vendor-card";
import { MOCK_EVENTS, MOCK_VENDORS } from "@/lib/mock-data";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const STATS = [
  { value: "12,000+", label: "Events hosted",    icon: Calendar },
  { value: "850+",    label: "Verified vendors",  icon: Shield },
  { value: "2.4M+",  label: "Happy attendees",   icon: Users },
  { value: "48",     label: "Cities covered",     icon: Globe },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Browse thousands of events and confirm your spot in seconds with our frictionless checkout.",
    color: "text-[#6366f1]",
    bg: "bg-[#eef2ff] dark:bg-[#1e1b4b]",
  },
  {
    icon: Shield,
    title: "Verified Vendors",
    description: "Every vendor is vetted, reviewed, and backed by our EventSphere Guarantee for your peace of mind.",
    color: "text-[#8b5cf6]",
    bg: "bg-[#f5f3ff] dark:bg-[#2e1065]",
  },
  {
    icon: TrendingUp,
    title: "Vendor Dashboard",
    description: "Powerful tools for event creators — analytics, ticketing, attendee management, and revenue tracking.",
    color: "text-[#22c55e]",
    bg: "bg-[#f0fdf4] dark:bg-[#052e16]",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Personalized event discovery powered by AI that understands your interests and location.",
    color: "text-[#eab308]",
    bg: "bg-[#fefce8] dark:bg-[#422006]",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="bg-brand-gradient-subtle absolute inset-0 opacity-50" />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(circle, #6366f1, #8b5cf6)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex mb-6">
              <Badge variant="default" size="lg" className="gap-2 px-4 py-2">
                <Sparkles className="h-3.5 w-3.5" />
                India&apos;s #1 Event Marketplace
                <ChevronRight className="h-3.5 w-3.5" />
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl leading-[1.1]"
              style={{ color: "var(--text-1)" }}
            >
              Discover &amp; host{" "}
              <span className="gradient-text">extraordinary</span>
              <br />
              events, effortlessly.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--text-3)" }}
            >
              EventSphere connects event-goers with India&apos;s best curated experiences —
              from tech conferences to wellness retreats, jazz festivals to food carnivals.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="xl" asChild>
                <Link href="/events">
                  Explore Events <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/dashboard">Host an Event</Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <AvatarGroup count={2400}>
                {["KP","AJ","SM","RV"].map((l) => (
                  <Avatar key={l} size="sm">
                    <AvatarFallback>{l[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className="text-sm" style={{ color: "var(--text-3)" }}>
                <span className="font-semibold" style={{ color: "var(--text-1)" }}>2,400+</span>{" "}
                people joined this week
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
                <span className="ml-1 text-sm font-semibold" style={{ color: "var(--text-1)" }}>4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative mt-16 flex justify-center"
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y py-10" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-1)" }}>{value}</p>
                <p className="text-sm" style={{ color: "var(--text-3)" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="default" size="md" className="mb-3">Featured</Badge>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>Upcoming Events</h2>
              <p className="mt-2" style={{ color: "var(--text-3)" }}>Handpicked experiences you won&apos;t want to miss.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/events">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_EVENTS.filter((e) => e.featured).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <EventCard event={event} variant="featured" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-20" style={{ background: "var(--bg-subtle)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge variant="violet" size="md" className="mb-3">Why EventSphere</Badge>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>
              Everything you need, nothing you don&apos;t.
            </h2>
            <p className="mt-3 max-w-lg mx-auto" style={{ color: "var(--text-3)" }}>
              Built for attendees and event creators alike.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card variant="default" interactive className="h-full">
                  <CardContent className="pt-6">
                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${f.bg}`}>
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: "var(--text-1)" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Vendors ───────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="success" size="md" className="mb-3">Verified Vendors</Badge>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>Top Event Creators</h2>
              <p className="mt-2" style={{ color: "var(--text-3)" }}>Partner with India&apos;s most trusted event professionals.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/vendors">See all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_VENDORS.map((vendor, i) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <VendorCard vendor={vendor} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-brand-gradient p-12 text-center"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">Start for free</Badge>
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                Ready to host your next event?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                Join 850+ verified vendors on EventSphere and reach millions of event-goers across India.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="xl"
                  className="bg-white text-[#4338ca] hover:bg-white/95 shadow-lg font-semibold"
                  asChild
                >
                  <Link href="/dashboard">
                    Start hosting free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white hover:bg-white/15 border border-white/30"
                  asChild
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
