import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely with clsx + tailwind-merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format date range */
export function formatDateRange(start: Date, end?: Date): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const fmtYear = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!end) return fmtYear.format(start);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameYear && sameMonth) {
    return `${fmt.format(start)}–${end.getDate()}, ${start.getFullYear()}`;
  }
  if (sameYear) {
    return `${fmt.format(start)} – ${fmtYear.format(end)}`;
  }
  return `${fmtYear.format(start)} – ${fmtYear.format(end)}`;
}

/** Truncate text */
export function truncate(str: string, length = 100): string {
  return str.length > length ? str.slice(0, length).trimEnd() + "…" : str;
}

/** Random integer between min and max (inclusive) */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pluralize a word */
export function pluralize(count: number, word: string, plural = `${word}s`) {
  return count === 1 ? `${count} ${word}` : `${count} ${plural}`;
}
