"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin, Star, CheckCircle2, Clock, Globe,
  ArrowRight, Share2, Heart, ChevronRight,
  ShieldCheck, Calendar, MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/service-detail/image-gallery";
import { BookingCard } from "@/components/service-detail/booking-card";
import { ReviewCard, RatingSummary } from "@/components/service-detail/review-card";
import { ServiceCard } from "@/components/marketplace/service-card";
import { MOCK_SERVICES } from "@/lib/mock-services";
import { getServiceDetail } from "@/lib/mock-service-details";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

/* ─── Animation helpers ───────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease },
};

/* Stagger container + item pair */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.42, ease } },
};

function SectionDivider() {
  return <Separator className="my-12" />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-[--text-1] mb-7">{children}</h2>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  const service = MOCK_SERVICES.find((s) => s.slug === slug);
  const detail = getServiceDetail(slug);

  if (!service || !detail) notFound();

  const [saved, setSaved] = React.useState(false);

  const { scrollY } = useScroll();
  // Subtle parallax: right column drifts up 20px over first 600px of scroll
  const rightColY = useTransform(scrollY, [0, 600], [0, -20]);

  const avgRating =
    detail.reviews.reduce((s, r) => s + r.rating, 0) / (detail.reviews.length || 1);

  const relatedServices = MOCK_SERVICES.filter(
    (s) => s.id !== service.id && s.category === service.category
  ).slice(0, 3).concat(
    MOCK_SERVICES.filter(
      (s) => s.id !== service.id && s.category !== service.category
    ).slice(0, 3 - MOCK_SERVICES.filter((s) => s.id !== service.id && s.category === service.category).length)
  );

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="pt-16">
        {/* ── Breadcrumb ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5"
        >
          <nav className="flex items-center gap-1.5 text-xs text-[--text-4]">
            <Link href="/" className="hover:text-[--text-2] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-[--text-2] transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/services?cat=${service.category.toLowerCase()}`}
              className="hover:text-[--text-2] transition-colors"
            >
              {service.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[--text-2] font-medium truncate max-w-[200px]">{service.title}</span>
          </nav>
        </motion.div>

        {/* ── Image Gallery ────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <ImageGallery images={detail.images} title={service.title} />
        </div>

        {/* ── Main content ─────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-14 xl:gap-20">

            {/* ════════════════════════════════════════════
                LEFT COLUMN
            ════════════════════════════════════════════ */}
            <div className="min-w-0">

              {/* ── Title + Meta ─────────────────────────── */}
              <motion.div {...fadeUp}>
                {/* Category + actions row */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="default" size="md">{service.category}</Badge>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1] transition-all border border-[--border]"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                    <button
                      onClick={() => setSaved((v) => !v)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all border",
                        saved
                          ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-950/30 dark:border-red-900"
                          : "border-[--border] text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1]"
                      )}
                    >
                      <Heart className={cn("h-3.5 w-3.5", saved && "fill-red-500 text-red-500")} />
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-[--text-1] leading-tight mb-3">
                  {service.title}
                </h1>
                <p className="text-lg text-[--text-3] leading-relaxed mb-5">
                  {detail.tagline}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[--border]"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-[--text-1]">{avgRating.toFixed(1)}</span>
                    <a
                      href="#reviews"
                      className="text-[--text-4] hover:text-[--text-2] underline underline-offset-2 transition-colors"
                    >
                      ({detail.reviews.length} reviews)
                    </a>
                  </div>
                  <span className="text-[--border]">·</span>
                  <div className="flex items-center gap-1.5 text-[--text-3]">
                    <MapPin className="h-3.5 w-3.5" />
                    {service.location}, {service.city}
                  </div>
                  {service.supplier.verified && (
                    <>
                      <span className="text-[--border]">·</span>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Verified supplier</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              <SectionDivider />

              {/* ── Supplier chip ─────────────────────────── */}
              <motion.div {...fadeUp} className="flex items-center gap-4">
                <Avatar size="lg">
                  {service.supplier.avatar && (
                    <AvatarImage src={service.supplier.avatar} alt={service.supplier.name} />
                  )}
                  <AvatarFallback className="text-sm font-bold bg-[#6366f1] text-white">
                    {service.supplier.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-[--text-1]">{service.supplier.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-[--text-3]">Supplier · {service.category}</p>
                    {service.supplier.verified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </Button>
                </div>
              </motion.div>

              <SectionDivider />

              {/* ── Description ───────────────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>About this service</SectionTitle>
                <div className="space-y-4">
                  {detail.longDescription.split("\n\n").map((para, i) => (
                    <p key={i} className="text-[--text-2] leading-[1.9] text-base">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>

              <SectionDivider />

              {/* ── What's included ───────────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>What&apos;s included</SectionTitle>
                <motion.div
                  className="grid sm:grid-cols-2 gap-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  {detail.included.map((item, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItem}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#6366f1] mt-0.5 shrink-0" />
                      <span className="text-sm text-[--text-2] leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <SectionDivider />

              {/* ── Features / Highlights ─────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>Why choose us</SectionTitle>
                <motion.div
                  className="grid sm:grid-cols-2 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  {detail.features.map((feat, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItem}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="flex items-start gap-4 rounded-xl border border-[--border] bg-[--bg-subtle] p-4 hover:border-[#6366f1]/30 hover:bg-[#eef2ff]/40 dark:hover:bg-[#1e1b4b]/20 transition-colors duration-200 cursor-default"
                    >
                      <span className="text-2xl leading-none mt-0.5 select-none">{feat.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-[--text-1] mb-0.5">{feat.title}</p>
                        <p className="text-xs text-[--text-3] leading-relaxed">{feat.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <SectionDivider />

              {/* ── Packages ──────────────────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>Pricing packages</SectionTitle>
                <motion.div
                  className="grid sm:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  {detail.packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      variants={staggerItem}
                      whileHover={{ y: -4, transition: { duration: 0.22 } }}
                      className={cn(
                        "relative flex flex-col rounded-2xl border p-5 transition-all duration-200",
                        pkg.popular
                          ? "border-[#6366f1] bg-[#eef2ff]/60 dark:bg-[#1e1b4b]/40 shadow-[0_0_0_1px_#6366f1]"
                          : "border-[--border] bg-[--bg-subtle] hover:border-[#6366f1]/40"
                      )}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6366f1] px-3 py-1 text-[10px] font-bold text-white whitespace-nowrap">
                          Most popular
                        </span>
                      )}
                      <p className={cn("text-base font-bold mb-1", pkg.popular ? "text-[#4f46e5]" : "text-[--text-1]")}>
                        {pkg.label}
                      </p>
                      <p className="text-xs text-[--text-3] mb-4 leading-relaxed">{pkg.description}</p>
                      <div className="mb-4">
                        <span className="text-2xl font-bold tabular-nums text-[--text-1]">
                          {CURRENCY_SYMBOL}{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-[--text-4] ml-1">{pkg.unit}</span>
                      </div>
                      <ul className="space-y-2 mb-5 flex-1">
                        {pkg.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-[--text-2]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#6366f1] mt-0.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={pkg.popular ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                      >
                        Select {pkg.label}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <SectionDivider />

              {/* ── Booking info chips ────────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>Good to know</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Clock,    label: "Response time",         value: detail.responseTime },
                    { icon: Calendar, label: "Minimum notice",        value: detail.minimumNotice },
                    { icon: ShieldCheck, label: "Cancellation",       value: detail.cancellationPolicy },
                    { icon: Globe,    label: "Languages",             value: detail.languages.join(", ") },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl border border-[--border] bg-[--bg-subtle] p-4">
                      <Icon className="h-5 w-5 text-[#6366f1] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[--text-4] mb-0.5">{label}</p>
                        <p className="text-sm text-[--text-2]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[--border] bg-[--bg-subtle] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[--text-4] mb-2">
                    Areas served
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {detail.areasServed.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 rounded-full border border-[--border] bg-[--bg] px-2.5 py-1 text-xs text-[--text-2]"
                      >
                        <MapPin className="h-3 w-3 text-[--text-4]" /> {area}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <SectionDivider />

              {/* ── Reviews ───────────────────────────────── */}
              <motion.div id="reviews" {...fadeUp}>
                <SectionTitle>
                  Reviews
                  <span className="ml-2 text-lg font-normal text-[--text-4]">
                    ({detail.reviews.length})
                  </span>
                </SectionTitle>

                <RatingSummary reviews={detail.reviews} />

                <div className="grid sm:grid-cols-2 sm:gap-x-10">
                  {detail.reviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                </div>
              </motion.div>

              <SectionDivider />

              {/* ── Supplier card ─────────────────────────── */}
              <motion.div {...fadeUp}>
                <SectionTitle>About the supplier</SectionTitle>
                <div className="rounded-2xl border border-[--border] bg-[--bg-subtle] p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <Avatar size="lg">
                        {service.supplier.avatar && (
                          <AvatarImage src={service.supplier.avatar} alt={service.supplier.name} />
                        )}
                        <AvatarFallback className="text-base font-bold bg-[#6366f1] text-white">
                          {service.supplier.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {service.supplier.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#6366f1] border-2 border-[--bg-subtle]">
                          <ShieldCheck className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[--text-1]">{service.supplier.name}</p>
                      <p className="text-sm text-[--text-3] mt-0.5">{service.category} · {service.location}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-[--text-1]">{service.rating}</span>
                        <span className="text-xs text-[--text-4]">({service.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vendors/${slug}`}>
                        View profile <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>

                  <p className="text-sm text-[--text-2] leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-3.5 w-3.5" /> Send Message
                    </Button>
                    <Button size="sm" className="flex-1">
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* ── Mobile booking card ───────────────────── */}
              <div className="lg:hidden mt-12">
                <BookingCard
                  basePrice={service.price}
                  rating={service.rating}
                  reviewCount={service.reviewCount}
                  packages={detail.packages}
                  responseTime={detail.responseTime}
                  instantBook={service.instantBook ?? false}
                  supplierId={service.id}
                />
              </div>

            </div>{/* /LEFT */}

            {/* ════════════════════════════════════════════
                RIGHT COLUMN — sticky booking card
            ════════════════════════════════════════════ */}
            <div className="hidden lg:block">
              <motion.div style={{ y: rightColY }} className="sticky top-24 space-y-4">
                <BookingCard
                  basePrice={service.price}
                  rating={service.rating}
                  reviewCount={service.reviewCount}
                  packages={detail.packages}
                  responseTime={detail.responseTime}
                  instantBook={service.instantBook ?? false}
                  supplierId={service.id}
                />

                {/* Quick info below card */}
                <div className="rounded-2xl border border-[--border] bg-[--bg-subtle] p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[--text-4]">
                    Quick info
                  </p>
                  {[
                    { icon: Clock,    label: detail.responseTime },
                    { icon: Calendar, label: `Min. ${detail.minimumNotice} notice` },
                    { icon: ShieldCheck, label: detail.cancellationPolicy },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-start gap-2.5 text-xs text-[--text-3]">
                      <Icon className="h-3.5 w-3.5 text-[#6366f1] mt-0.5 shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>{/* /grid */}
        </div>{/* /main container */}

        {/* ── Related Services ───────────────────────────────── */}
        {relatedServices.length > 0 && (
          <section className="mt-20 py-16 border-t border-[--border]" style={{ background: "var(--bg-subtle)" }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[--text-1]">Similar services</h2>
                  <p className="text-sm text-[--text-3] mt-1">Other top-rated vendors you might like</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/services">
                    Browse all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
              >
                {relatedServices.map((svc) => (
                  <motion.div key={svc.id} variants={staggerItem}>
                    <ServiceCard service={svc} variant="grid" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        <div className="mt-0">
          <Footer />
        </div>
      </div>

      {/* ── Mobile sticky CTA bar ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[--border] bg-[--bg]/90 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[--text-4] uppercase tracking-widest font-semibold leading-none mb-0.5">
            From
          </p>
          <p className="text-lg font-bold text-[--text-1] leading-none tabular-nums">
            {CURRENCY_SYMBOL}{service.price.toLocaleString()}
          </p>
        </div>
        <a
          href="#booking"
          className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] transition-shadow"
        >
          {detail.packages.some(p => p.popular) ? "Book Now" : "Request to Book"}
        </a>
      </div>
    </div>
  );
}
