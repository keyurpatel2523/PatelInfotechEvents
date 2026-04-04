"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Calendar, ArrowRight, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Vendor } from "@/lib/mock-data";

interface VendorCardProps {
  vendor: Vendor;
  className?: string;
}

const BADGE_VARIANTS: Record<string, "brand" | "violet" | "success"> = {
  "Top Vendor": "brand",
  "Premium":    "violet",
  "Rising Star": "success",
};

export function VendorCard({ vendor, className }: VendorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative rounded-2xl border border-[--border] bg-[--bg] p-5",
        "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        "transition-shadow duration-300",
        className
      )}
    >
      {/* Background gradient accent */}
      <div className="absolute inset-x-0 top-0 h-20 rounded-t-2xl bg-brand-gradient-subtle opacity-60" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar size="lg">
                <AvatarImage src={vendor.avatar} alt={vendor.name} />
                <AvatarFallback>{vendor.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {vendor.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 border-2 border-[--bg]">
                  <ShieldCheck className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[--text-1] leading-tight">{vendor.name}</h3>
              <p className="text-xs text-[--text-3] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {vendor.location}
              </p>
            </div>
          </div>
          {vendor.badge && (
            <Badge variant={BADGE_VARIANTS[vendor.badge] ?? "secondary"} size="sm">
              {vendor.badge}
            </Badge>
          )}
        </div>

        {/* Category */}
        <Badge variant="secondary" size="sm" className="mb-3">
          {vendor.category}
        </Badge>

        {/* Description */}
        <p className="text-xs text-[--text-3] line-clamp-2 mb-4 leading-relaxed">
          {vendor.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Rating", value: vendor.rating.toFixed(1), icon: <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> },
            { label: "Reviews", value: vendor.reviewCount, icon: null },
            { label: "Events", value: vendor.eventsHosted, icon: <Calendar className="h-3.5 w-3.5 text-brand-500" /> },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 rounded-xl bg-[--bg-muted] p-2"
            >
              <div className="flex items-center gap-1">
                {icon}
                <span className="text-sm font-bold text-[--text-1]">{value}</span>
              </div>
              <span className="text-xs text-[--text-4]">{label}</span>
            </div>
          ))}
        </div>

        <Button asChild variant="outline" size="sm" className="w-full group/btn">
          <Link href={`/vendors/${vendor.slug}`}>
            View Profile
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
