"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { useToastStore }  from "@/store/toast";
import { SUPPLIER_REVIEWS, type SupplierReview } from "@/lib/mock-supplier";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Rating summary ─────────────────────────────────────────── */
function RatingSummary({ reviews }: { reviews: SupplierReview[] }) {
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] ?? 0) + 1; });

  return (
    <div className="rounded-2xl border border-[--border] bg-[--bg] p-6 shadow-[var(--shadow-sm)] flex items-center gap-8">
      {/* Big number */}
      <div className="text-center shrink-0">
        <p className="text-5xl font-bold text-[--text-1] tabular-nums leading-none">{avg}</p>
        <div className="flex justify-center gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-4 w-4 ${n <= Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-[--border]"}`}
            />
          ))}
        </div>
        <p className="text-xs text-[--text-3] mt-1">{reviews.length} reviews</p>
      </div>

      {/* Bar distribution */}
      <div className="flex-1 space-y-1.5 min-w-0">
        {[5, 4, 3, 2, 1].map((n) => {
          const count = dist[n] ?? 0;
          const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="text-[--text-3] w-6 text-right">{n}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
              <div className="flex-1 h-1.5 rounded-full bg-[--bg-muted] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.2 + (5 - n) * 0.06, duration: 0.4, ease: EASE }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
              <span className="text-[--text-4] w-5">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Review card ────────────────────────────────────────────── */
function ReviewCard({
  review,
  onReply,
}: {
  review:  SupplierReview;
  onReply: (id: string) => void;
}) {
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)] space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: review.color }}
          >
            {review.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[--text-1]">{review.customer}</p>
            <p className="text-xs text-[--text-3] truncate">{review.service}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-0.5 justify-end mb-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-3.5 w-3.5 ${n <= review.rating ? "fill-amber-400 text-amber-400" : "text-[--border]"}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-[--text-4]">
            {format(parseISO(review.date), "d MMM yyyy")}
          </p>
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-[--text-2] leading-relaxed">{review.text}</p>

      {/* Reply section */}
      <div>
        {review.replied ? (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <MessageSquare className="h-3.5 w-3.5" />
            You replied to this review
          </div>
        ) : (
          <button
            onClick={() => setReplyOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6366f1] hover:opacity-80 transition-opacity"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Reply to this review
            {replyOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}

        <AnimatePresence>
          {replyOpen && !review.replied && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                <textarea
                  rows={3}
                  placeholder="Write a professional, helpful reply…"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--bg-subtle] px-3.5 py-2.5 text-sm text-[--text-1] placeholder:text-[--text-4] resize-none focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-all"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyOpen(false)}
                    className="rounded-lg border border-[--border] px-3 py-1.5 text-xs font-semibold text-[--text-3] hover:border-[--text-4] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (replyText.trim()) {
                        onReply(review.id);
                        setReplyOpen(false);
                        setReplyText("");
                      }
                    }}
                    disabled={!replyText.trim()}
                    className="rounded-lg bg-[#6366f1] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4f46e5] disabled:opacity-40 transition-all"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ReviewsPage() {
  const { toast }  = useToastStore();
  const [reviews, setReviews] = React.useState<SupplierReview[]>(SUPPLIER_REVIEWS);
  const [filter,  setFilter]  = React.useState<number | "all">("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.rating === filter);

  function handleReply(id: string) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, replied: true } : r));
    toast({ title: "Reply posted", variant: "success" });
  }

  const unreplied = reviews.filter((r) => !r.replied).length;

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-3xl">

        {/* ── Heading ──────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[--text-1]">Reviews</h1>
            <p className="text-sm text-[--text-3] mt-0.5">
              {reviews.length} total · {unreplied} awaiting reply
            </p>
          </div>
          {unreplied > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              {unreplied} review{unreplied > 1 ? "s" : ""} need{unreplied === 1 ? "s" : ""} a reply
            </div>
          )}
        </div>

        {/* ── Rating summary ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <RatingSummary reviews={reviews} />
        </motion.div>

        {/* ── Filter by stars ───────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
              filter === "all"
                ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] dark:bg-[#1e1b4b]"
                : "border-[--border] text-[--text-3] hover:border-[--text-4]",
            )}
          >
            All reviews
          </button>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              className={cn(
                "flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                filter === n
                  ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] dark:bg-[#1e1b4b]"
                  : "border-[--border] text-[--text-3] hover:border-[--text-4]",
              )}
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {n}
            </button>
          ))}
        </div>

        {/* ── Review list ───────────────────────────────────── */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <ReviewCard review={review} onReply={handleReply} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <Star className="h-10 w-10 text-[--text-4] mb-4" />
              <h3 className="text-base font-bold text-[--text-1]">No reviews yet</h3>
              <p className="text-sm text-[--text-3] mt-1">Reviews will appear here once customers leave them.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
