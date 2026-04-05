"use client";

import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[--bg-muted]",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-[--border] bg-[--bg] overflow-hidden">
      {/* Image */}
      <Shimmer className="h-52 w-full rounded-none" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Category */}
        <Shimmer className="h-5 w-16 rounded-full" />
        {/* Title */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
        </div>
        {/* Location + rating row */}
        <div className="flex items-center justify-between pt-1">
          <Shimmer className="h-3.5 w-28" />
          <Shimmer className="h-3.5 w-16" />
        </div>
        {/* Price */}
        <div className="flex items-center justify-between border-t border-[--border-subtle] pt-3 mt-1">
          <Shimmer className="h-5 w-24" />
          <Shimmer className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex rounded-2xl border border-[--border] bg-[--bg] overflow-hidden h-44">
          <Shimmer className="w-56 shrink-0 rounded-none" />
          <div className="flex flex-col gap-3 flex-1 p-5 justify-between">
            <div>
              <Shimmer className="h-5 w-16 rounded-full mb-3" />
              <Shimmer className="h-5 w-3/4 mb-2" />
              <Shimmer className="h-4 w-full mb-1" />
              <Shimmer className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
