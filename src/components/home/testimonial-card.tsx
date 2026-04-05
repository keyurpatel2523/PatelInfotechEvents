"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TestimonialData {
  name: string;
  role: string;
  location: string;
  rating: number;
  event: string;
  text: string;
  initials: string;
  avatarColor: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
  index?: number;
}

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl border border-[--border]",
        "bg-[--bg] p-7",
        "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        "transition-shadow duration-300"
      )}
    >
      {/* Gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Quote icon */}
      <div className="flex items-start justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-[--border]"
              )}
            />
          ))}
        </div>
        <Quote className="h-6 w-6 text-[--border] rotate-180" />
      </div>

      {/* Quote text */}
      <blockquote className="flex-1 text-sm leading-relaxed text-[--text-2]">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>

      {/* Event tag */}
      <div className="rounded-xl border border-[--border-subtle] bg-[--bg-subtle] px-3 py-1.5">
        <p className="text-[11px] font-medium text-[--text-4]">
          For: <span className="text-[--text-3]">{testimonial.event}</span>
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-1 border-t border-[--border-subtle]">
        <Avatar size="md">
          <AvatarFallback
            style={{ background: testimonial.avatarColor, color: "white" }}
            className="text-xs font-bold"
          >
            {testimonial.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-[--text-1]">{testimonial.name}</p>
          <p className="text-xs text-[--text-4]">
            {testimonial.role} · {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
