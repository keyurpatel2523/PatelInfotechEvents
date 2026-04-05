"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid3x3, Expand, ZoomIn } from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

/* ─── Full-screen modal ───────────────────────────────────── */
function GalleryModal({
  images,
  title,
  open,
  initialIndex,
  onClose,
}: {
  images: string[];
  title: string;
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = React.useState(initialIndex);
  const [view, setView] = React.useState<"single" | "grid">("single");
  const [dir, setDir] = React.useState(0); // -1 prev, +1 next

  React.useEffect(() => {
    setActiveIdx(initialIndex);
    setView("single");
    setDir(0);
  }, [initialIndex, open]);

  const prev = () => {
    setDir(-1);
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = () => {
    setDir(1);
    setActiveIdx((i) => (i + 1) % images.length);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slideVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        size="full"
        className="!p-0 max-h-[95vh] overflow-hidden flex flex-col bg-zinc-950 border-zinc-800"
        showClose={false}
      >
        <DialogTitle className="sr-only">{title} — Photo gallery</DialogTitle>

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 shrink-0">
          <p className="text-sm font-semibold text-white">
            {view === "single"
              ? `${activeIdx + 1} / ${images.length}`
              : `${images.length} photos`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === "single" ? "grid" : "single")}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              {view === "single" ? "All photos" : "Single view"}
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          {view === "single" ? (
            <div className="relative flex h-full min-h-[60vh] items-center justify-center px-16 py-8">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={activeIdx}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className="relative w-full max-h-[70vh] aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={images[activeIdx]}
                    alt={`${title} — photo ${activeIdx + 1}`}
                    fill
                    className="object-cover"
                    sizes="90vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.85)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={next}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.85)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
              {images.map((src, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setActiveIdx(i); setView("single"); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-xl",
                    "ring-2 transition-all duration-150",
                    i === activeIdx ? "ring-[#6366f1]" : "ring-transparent hover:ring-zinc-500"
                  )}
                >
                  <Image
                    src={src}
                    alt={`${title} — photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="30vw"
                  />
                  {i === activeIdx && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-[#6366f1] rounded-xl" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip (single view only) */}
        {view === "single" && (
          <div className="flex gap-2 overflow-x-auto px-5 py-3 border-t border-zinc-800 shrink-0 no-scrollbar">
            {images.map((src, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIdx(i)}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl",
                  "ring-2 transition-all duration-150",
                  i === activeIdx ? "ring-[#6366f1]" : "ring-transparent opacity-50"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </motion.button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Hover zoom image tile ───────────────────────────────── */
function ImageTile({
  src,
  alt,
  sizes,
  className,
  onClick,
  priority = false,
  zoomScale = 1.06,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  onClick: () => void;
  priority?: boolean;
  zoomScale?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hovered"
      whileTap="tapped"
      className={cn("group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]", className)}
    >
      {/* Zoom layer */}
      <motion.div
        variants={{ hovered: { scale: zoomScale }, tapped: { scale: 1.02 } }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      </motion.div>

      {/* Dark scrim on hover */}
      <motion.div
        variants={{ hovered: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/20"
      />

      {/* Zoom icon badge */}
      <motion.div
        variants={{ hovered: { opacity: 1, scale: 1, y: 0 } }}
        initial={{ opacity: 0, scale: 0.8, y: 4 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="flex items-center justify-center h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white">
          <ZoomIn className="h-4 w-4" />
        </span>
      </motion.div>
    </motion.button>
  );
}

/* ─── Main gallery grid ───────────────────────────────────── */
export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalIdx, setModalIdx] = React.useState(0);

  const openAt = (i: number) => {
    setModalIdx(i);
    setModalOpen(true);
  };

  const primary = images[0];
  const secondary = images.slice(1, 5);

  return (
    <>
      {/* ── Grid layout ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] sm:h-[560px]">
          {/* Primary — spans 2 cols + 2 rows */}
          <ImageTile
            src={primary}
            alt={`${title} — main photo`}
            sizes="50vw"
            className="col-span-2 row-span-2 rounded-l-2xl"
            onClick={() => openAt(0)}
            priority
            zoomScale={1.05}
          />

          {/* Secondary images — 2x2 grid */}
          {secondary.map((src, i) => {
            const isTopRight    = i === 1;
            const isBottomRight = i === 3;
            return (
              <ImageTile
                key={i}
                src={src}
                alt={`${title} — photo ${i + 2}`}
                sizes="25vw"
                className={cn(
                  isTopRight    && "rounded-tr-2xl",
                  isBottomRight && "rounded-br-2xl"
                )}
                onClick={() => openAt(i + 1)}
                zoomScale={1.08}
              />
            );
          })}
        </div>

        {/* Show all photos button */}
        <motion.button
          onClick={() => { setModalIdx(0); setModalOpen(true); }}
          whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,1)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute bottom-4 right-4",
            "flex items-center gap-2",
            "rounded-xl border border-white/30 bg-white/90 backdrop-blur-sm",
            "px-4 py-2 text-xs font-semibold text-zinc-800",
            "shadow-[var(--shadow-md)]",
          )}
        >
          <Expand className="h-3.5 w-3.5" />
          Show all {images.length} photos
        </motion.button>
      </motion.div>

      {/* ── Modal ───────────────────────────────────────── */}
      <GalleryModal
        images={images}
        title={title}
        open={modalOpen}
        initialIndex={modalIdx}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
