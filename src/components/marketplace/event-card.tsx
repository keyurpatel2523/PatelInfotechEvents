"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Heart, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Event } from "@/lib/mock-data";

interface EventCardProps {
  event: Event;
  variant?: "default" | "horizontal" | "compact" | "featured";
  className?: string;
}

export function EventCard({ event, variant = "default", className }: EventCardProps) {
  const [saved, setSaved] = React.useState(false);
  const fillPercent = Math.round((event.attendees / event.capacity) * 100);
  const almostFull = fillPercent >= 85;

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (variant === "featured") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "group relative overflow-hidden rounded-3xl border border-[--border]",
          "bg-[--bg] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)]",
          "transition-shadow duration-300",
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="brand" size="md">Featured</Badge>
            <Badge
              variant="secondary"
              size="md"
              className="glass dark:bg-black/40"
            >
              {event.category}
            </Badge>
          </div>

          {/* Save button */}
          <button
            onClick={() => setSaved((v) => !v)}
            className={cn(
              "absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl",
              "glass transition-all duration-150 hover:scale-110",
            )}
          >
            <Heart className={cn("h-4 w-4", saved ? "fill-red-500 text-red-500" : "text-white")} />
          </button>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 inset-x-0 p-5">
            <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.city}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage src={event.vendor.avatar} />
                <AvatarFallback>{event.vendor.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium text-[--text-2]">{event.vendor.name}</p>
                {event.vendor.verified && (
                  <p className="text-xs text-brand-500">✓ Verified vendor</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span className="text-sm font-semibold text-[--text-1]">{event.rating}</span>
              <span className="text-xs text-[--text-3]">({event.reviewCount})</span>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[--text-3] mb-1.5">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.attendees.toLocaleString()} attending</span>
              {almostFull && <span className="text-amber-600 font-medium">Almost full!</span>}
            </div>
            <div className="h-1.5 rounded-full bg-[--bg-muted] overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  almostFull ? "bg-amber-500" : "bg-brand-gradient"
                )}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {event.price === 0 ? (
                <span className="text-lg font-bold text-green-600">Free</span>
              ) : (
                <div>
                  <span className="text-lg font-bold text-[--text-1]">
                    {formatCurrency(event.price, "GBP", "en-GB")}
                  </span>
                  {event.priceLabel && (
                    <span className="text-xs text-[--text-3] ml-1">/{event.priceLabel}</span>
                  )}
                </div>
              )}
            </div>
            <Button asChild size="sm">
              <Link href={`/events/${event.slug}`}>
                Book Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "group flex gap-4 rounded-2xl border border-[--border] bg-[--bg] p-4",
          "hover:border-[--text-4] hover:shadow-[var(--shadow-md)]",
          "transition-all duration-200",
          className
        )}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
          {event.price === 0 && (
            <div className="absolute bottom-1.5 left-1.5">
              <Badge variant="success" size="sm">Free</Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm text-[--text-1] line-clamp-1 leading-tight">
                {event.title}
              </h3>
              <button onClick={() => setSaved((v) => !v)} className="shrink-0">
                <Heart className={cn("h-4 w-4", saved ? "fill-red-500 text-red-500" : "text-[--text-4]")} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-[--text-3]">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.city}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-medium text-[--text-1]">{event.rating}</span>
            </div>
            <span className="text-sm font-bold text-[--text-1]">
              {event.price === 0 ? "Free" : formatCurrency(event.price, "GBP", "en-GB")}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // default card
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[--border] bg-[--bg]",
        "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        "transition-shadow duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            size="sm"
            className="glass dark:bg-black/40 text-white border-white/20"
          >
            {event.category}
          </Badge>
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved((v) => !v)}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg glass hover:scale-110 transition-transform duration-150"
        >
          <Heart className={cn("h-3.5 w-3.5", saved ? "fill-red-500 text-red-500" : "text-white")} />
        </button>

        {event.price === 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="success" size="sm">Free Entry</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-[--text-1] line-clamp-2 leading-snug mb-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-[--text-3]">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formattedDate} · {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[--text-3]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{event.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[--border-subtle]">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-[--text-1]">{event.rating}</span>
            <span className="text-xs text-[--text-4]">({event.reviewCount})</span>
          </div>
          <div className="text-right">
            {event.price === 0 ? (
              <span className="text-sm font-bold text-green-600">Free</span>
            ) : (
              <span className="text-sm font-bold text-[--text-1]">
                {formatCurrency(event.price, "GBP", "en-GB")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
