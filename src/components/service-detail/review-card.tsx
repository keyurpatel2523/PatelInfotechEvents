"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ReviewData } from "@/lib/mock-service-details";

interface ReviewCardProps {
  review: ReviewData;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex flex-col gap-4 py-6 border-b border-[--border-subtle] last:border-b-0"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < review.rating ? "fill-amber-400 text-amber-400" : "text-[--border]"
            )}
          />
        ))}
      </div>

      {/* Quote text */}
      <blockquote className="text-sm leading-relaxed text-[--text-2]">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      {/* Event tag */}
      <div className="self-start rounded-full border border-[--border-subtle] bg-[--bg-subtle] px-3 py-1 text-[11px] font-medium text-[--text-4]">
        {review.eventType}
      </div>

      {/* Author row */}
      <div className="flex items-center gap-3 pt-1 border-t border-[--border-subtle]">
        <Avatar size="sm">
          <AvatarFallback
            style={{ background: review.avatarColor, color: "white" }}
            className="text-xs font-bold"
          >
            {review.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-[--text-1]">{review.author}</p>
          <p className="text-xs text-[--text-4]">{review.date}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Rating summary bar ──────────────────────────────────── */
interface RatingSummaryProps {
  reviews: ReviewData[];
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 text-right text-xs font-medium text-[--text-2]">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[--bg-muted] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="h-full rounded-full bg-amber-400"
        />
      </div>
      <span className="text-xs text-[--text-4] w-5">{count}</span>
    </div>
  );
}

export function RatingSummary({ reviews }: RatingSummaryProps) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    label: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-start gap-8 rounded-2xl bg-[--bg-subtle] p-6 mb-8">
      {/* Big number */}
      <div className="flex flex-col items-center gap-1 min-w-[80px]">
        <span className="text-5xl font-bold tracking-tight text-[--text-1]">
          {avg.toFixed(1)}
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-[--border]"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-[--text-4]">{reviews.length} reviews</span>
      </div>

      {/* Bars */}
      <div className="flex-1 w-full space-y-2">
        {counts.map(({ label, count }) => (
          <RatingBar key={label} label={String(label)} count={count} total={reviews.length} />
        ))}
      </div>
    </div>
  );
}
