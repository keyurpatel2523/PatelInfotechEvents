"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import {
  MapPin, Star, Heart, ArrowUpRight,
  CheckCircle2, Share2, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

/* ─── Types ───────────────────────────────────────────────── */
export interface ServiceCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryColor?: "default" | "violet" | "success" | "warning" | "secondary";
  image: string;
  price: number;
  originalPrice?: number;
  priceLabel?: string;
  priceUnit?: string;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  featured?: boolean;
  instantBook?: boolean;
  newListing?: boolean;
  supplier: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

/* ─── CVA ─────────────────────────────────────────────────── */
const cardVariants = cva(
  [
    "group relative bg-[--bg] border border-[--border]",
    "overflow-hidden cursor-pointer select-none",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        grid: [
          "flex flex-col rounded-2xl",
          "shadow-[var(--shadow-sm)]",
          "hover:shadow-[var(--shadow-xl)] hover:border-[--text-4]",
        ],
        list: [
          "flex flex-row items-stretch rounded-2xl",
          "shadow-[var(--shadow-sm)]",
          "hover:shadow-[var(--shadow-lg)] hover:border-[--text-4]",
        ],
        compact: [
          "flex flex-row items-center gap-3 rounded-xl p-3",
          "hover:bg-[--bg-subtle] hover:border-[--text-4]",
        ],
      },
    },
    defaultVariants: { variant: "grid" },
  }
);

/* ─── Pixel-perfect half-star ─────────────────────────────── */
function StarRating({
  rating,
  count,
  id,
}: {
  rating: number;
  count: number;
  id: string; // unique per card to avoid SVG gradient collision
}) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.3 && rating % 1 < 0.8;
  const empty = 5 - full - (half ? 1 : 0);
  const gradId = `star-half-${id}`;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" />
        ))}
        {half && (
          <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={gradId}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradId})`}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className="h-3 w-3 text-[--border]" />
        ))}
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
        {rating.toFixed(1)}
      </span>
      <span className="text-xs" style={{ color: "var(--text-4)" }}>
        ({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})
      </span>
    </div>
  );
}

/* ─── Price display ───────────────────────────────────────── */
function PriceTag({
  price,
  originalPrice,
  priceUnit,
  size = "sm",
}: {
  price: number;
  originalPrice?: number;
  priceUnit?: string;
  size?: "sm" | "md";
}) {
  const base = price === 0
    ? "Free"
    : `${CURRENCY_SYMBOL}${price.toLocaleString()}`;

  const textSize = size === "md" ? "text-base" : "text-sm";

  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          `${textSize} font-bold tabular-nums`,
          price === 0 ? "text-green-600" : ""
        )}
        style={{ color: price > 0 ? "var(--text-1)" : undefined }}
      >
        {base}
      </span>
      {price > 0 && originalPrice && originalPrice > price && (
        <span className="text-xs tabular-nums line-through" style={{ color: "var(--text-4)" }}>
          {CURRENCY_SYMBOL}{originalPrice.toLocaleString()}
        </span>
      )}
      {price > 0 && priceUnit && (
        <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
          /{priceUnit}
        </span>
      )}
    </div>
  );
}

/* ─── Supplier chip ───────────────────────────────────────── */
function SupplierChip({
  supplier,
  size = "sm",
}: {
  supplier: ServiceCardData["supplier"];
  size?: "sm" | "xs";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 min-w-0 cursor-default">
          <Avatar size={size === "xs" ? "xs" : "xs"}>
            <AvatarImage src={supplier.avatar} alt={supplier.name} />
            <AvatarFallback className="text-[9px]">
              {supplier.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className="text-xs truncate"
            style={{ color: "var(--text-3)" }}
          >
            {supplier.name}
          </span>
          {supplier.verified && (
            <CheckCircle2 className="h-3 w-3 shrink-0 text-[#6366f1]" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        {supplier.verified ? `${supplier.name} · Verified supplier` : supplier.name}
      </TooltipContent>
    </Tooltip>
  );
}

/* ─── Save button ─────────────────────────────────────────── */
function SaveButton({
  saved,
  onToggle,
  size = "md",
}: {
  saved: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconDim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.78 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      aria-label={saved ? "Remove from saved" : "Save"}
      className={cn(
        dim,
        "flex items-center justify-center rounded-full",
        "glass border border-white/20 shadow-sm",
        "transition-colors duration-150 hover:scale-110"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={saved ? "saved" : "unsaved"}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={cn(
              iconDim, "transition-colors duration-150",
              saved ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Discount badge ──────────────────────────────────────── */
function DiscountBadge({ original, current }: { original: number; current: number }) {
  const pct = Math.round(((original - current) / original) * 100);
  if (pct <= 0) return null;
  return (
    <span className="rounded-md bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
      -{pct}%
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   ServiceCard
══════════════════════════════════════════════════════════════ */
export interface ServiceCardProps extends VariantProps<typeof cardVariants> {
  service: ServiceCardData;
  className?: string;
  onSave?: (id: string, saved: boolean) => void;
  saved?: boolean;
  priority?: boolean;
  /** Show quick-action buttons on hover (grid only) */
  showQuickActions?: boolean;
}

function ServiceCardInner({
  service,
  variant = "grid",
  className,
  onSave,
  saved = false,
  priority = false,
  showQuickActions = true,
}: ServiceCardProps) {
  const [isSaved, setIsSaved] = React.useState(saved);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  React.useEffect(() => setIsSaved(saved), [saved]);

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    onSave?.(service.id, next);
  }

  /* ────────────────────────────────────────────────────────────
     GRID variant
  ──────────────────────────────────────────────────────────── */
  if (variant === "grid") {
    return (
      <TooltipProvider delayDuration={300}>
        <motion.article
          whileHover={{ y: -5 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn(cardVariants({ variant }), className)}
        >
          <Link href={`/services/${service.slug}`} className="contents" tabIndex={0}>

            {/* ╔═══ IMAGE ════════════════════════════════════╗ */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[--bg-muted]">

              {/* Skeleton */}
              {!imgLoaded && <div className="absolute inset-0 skeleton" />}

              {/* Photo */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-all duration-500 ease-out will-change-transform",
                  "group-hover:scale-[1.07]",
                  imgLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImgLoaded(true)}
                priority={priority}
              />

              {/* Bottom gradient scrim */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

              {/* ── Top-left badges ── */}
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
                {service.featured && (
                  <Badge variant="brand" size="sm" className="shadow-sm">
                    ✦ Featured
                  </Badge>
                )}
                {service.newListing && !service.featured && (
                  <Badge variant="violet" size="sm">New</Badge>
                )}
              </div>

              {/* ── Save button ── */}
              <div className="absolute right-3 top-3 z-10">
                <SaveButton saved={isSaved} onToggle={handleSave} />
              </div>

              {/* ── Bottom-left: category + discount ── */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                <span className="rounded-lg bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {service.category}
                </span>
                {service.originalPrice && service.originalPrice > service.price && (
                  <DiscountBadge original={service.originalPrice} current={service.price} />
                )}
              </div>

              {/* ── Bottom-right: instant book ── */}
              {service.instantBook && (
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="flex items-center gap-1 rounded-lg bg-green-500/90 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <CheckCircle2 className="h-3 w-3" />
                    Instant
                  </span>
                </div>
              )}

              {/* ── Quick-action overlay on hover ── */}
              {showQuickActions && (
                <div
                  className={cn(
                    "absolute inset-0 z-10 flex items-center justify-center gap-2",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-lg backdrop-blur-sm"
                    aria-label="Quick view"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-lg backdrop-blur-sm"
                    aria-label="Share"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              )}
            </div>
            {/* ╚═══════════════════════════════════════════════╝ */}

            {/* ╔═══ BODY ════════════════════════════════════╗ */}
            <div className="flex flex-1 flex-col gap-2.5 p-4">

              {/* Title */}
              <h3
                className={cn(
                  "text-sm font-semibold leading-snug line-clamp-2",
                  "transition-colors duration-150",
                  "group-hover:text-[#6366f1]"
                )}
                style={{ color: "var(--text-1)" }}
              >
                {service.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1" style={{ color: "var(--text-3)" }}>
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="text-xs truncate">{service.city}</span>
              </div>

              {/* Rating */}
              <StarRating
                rating={service.rating}
                count={service.reviewCount}
                id={service.id}
              />

              {/* Spacer pushes footer to bottom */}
              <div className="flex-1" />

              {/* Divider */}
              <div className="h-px" style={{ background: "var(--border-subtle, var(--border))" }} />

              {/* Footer */}
              <div className="flex items-center justify-between gap-2">
                <SupplierChip supplier={service.supplier} />
                <PriceTag
                  price={service.price}
                  originalPrice={service.originalPrice}
                  priceUnit={service.priceUnit}
                />
              </div>
            </div>
            {/* ╚═══════════════════════════════════════════════╝ */}

          </Link>
        </motion.article>
      </TooltipProvider>
    );
  }

  /* ────────────────────────────────────────────────────────────
     LIST variant
  ──────────────────────────────────────────────────────────── */
  if (variant === "list") {
    return (
      <TooltipProvider delayDuration={300}>
        <motion.article
          whileHover={{ x: 3 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(cardVariants({ variant }), className)}
        >
          <Link href={`/services/${service.slug}`} className="contents" tabIndex={0}>

            {/* Image */}
            <div className="relative w-40 shrink-0 overflow-hidden bg-[--bg-muted] sm:w-52">
              {!imgLoaded && <div className="absolute inset-0 skeleton" />}
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 160px, 208px"
                className={cn(
                  "object-cover transition-transform duration-500 ease-out will-change-transform",
                  "group-hover:scale-[1.06]",
                  imgLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImgLoaded(true)}
                priority={priority}
              />

              {/* Badges */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {service.featured && <Badge variant="brand" size="sm">Featured</Badge>}
                {service.newListing && !service.featured && <Badge variant="violet" size="sm">New</Badge>}
              </div>

              {/* Save */}
              <div className="absolute right-2 top-2">
                <SaveButton saved={isSaved} onToggle={handleSave} size="sm" />
              </div>

              {/* Instant tag */}
              {service.instantBook && (
                <div className="absolute bottom-2 left-2">
                  <span className="flex items-center gap-1 rounded-md bg-green-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Instant
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
              <div className="space-y-2">

                {/* Category row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={service.categoryColor ?? "secondary"}
                    size="sm"
                  >
                    {service.category}
                  </Badge>
                  {service.originalPrice && service.originalPrice > service.price && (
                    <DiscountBadge original={service.originalPrice} current={service.price} />
                  )}
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-sm font-semibold leading-snug line-clamp-2",
                    "transition-colors duration-150 group-hover:text-[#6366f1]"
                  )}
                  style={{ color: "var(--text-1)" }}
                >
                  {service.title}
                </h3>

                {/* Description (list shows more) */}
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-3)" }}>
                  {service.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-end justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <StarRating
                    rating={service.rating}
                    count={service.reviewCount}
                    id={`list-${service.id}`}
                  />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "var(--text-3)" }}
                    >
                      <MapPin className="h-3 w-3 shrink-0" />
                      {service.city}
                    </span>
                    <SupplierChip supplier={service.supplier} />
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <PriceTag
                    price={service.price}
                    originalPrice={service.originalPrice}
                    priceUnit={service.priceUnit}
                    size="md"
                  />
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium text-[#6366f1]",
                      "translate-x-1 opacity-0 transition-all duration-200",
                      "group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  >
                    View details
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>

          </Link>
        </motion.article>
      </TooltipProvider>
    );
  }

  /* ────────────────────────────────────────────────────────────
     COMPACT variant  (used inside sidebars, result lists)
  ──────────────────────────────────────────────────────────── */
  return (
    <TooltipProvider delayDuration={300}>
      <motion.article
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
        className={cn(cardVariants({ variant }), className)}
      >
        <Link href={`/services/${service.slug}`} className="contents" tabIndex={0}>

          {/* Thumbnail */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[--bg-muted]">
            {!imgLoaded && <div className="absolute inset-0 skeleton" />}
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="56px"
              className={cn(
                "object-cover transition-transform duration-300",
                "group-hover:scale-110",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImgLoaded(true)}
              priority={priority}
            />
          </div>

          {/* Text */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className="text-xs font-semibold line-clamp-1 group-hover:text-[#6366f1] transition-colors"
              style={{ color: "var(--text-1)" }}
            >
              {service.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
                {service.category}
              </span>
              <span className="h-1 w-1 rounded-full bg-[--border]" />
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-semibold" style={{ color: "var(--text-2)" }}>
                  {service.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0">
            <span
              className={cn(
                "text-xs font-bold tabular-nums",
                service.price === 0 ? "text-green-600" : ""
              )}
              style={{ color: service.price > 0 ? "var(--text-1)" : undefined }}
            >
              {service.price === 0 ? "Free" : `${CURRENCY_SYMBOL}${service.price.toLocaleString()}`}
            </span>
          </div>

        </Link>
      </motion.article>
    </TooltipProvider>
  );
}

export const ServiceCard = React.memo(ServiceCardInner);
