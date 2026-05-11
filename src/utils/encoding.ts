import type { Book, ReadingStatus } from "../types/book";
import { colorForCountry } from "./countries";

const MIN_H = 130;
const MAX_H = 200;
const DEFAULT_H = 160;

export function yearRange(books: Book[]): { min: number; max: number } {
  const years = books
    .map((b) => b.publicationYear)
    .filter((y): y is number => typeof y === "number" && y > 0);
  if (years.length === 0) return { min: 1900, max: 2025 };
  return { min: Math.min(...years), max: Math.max(...years) };
}

export function spineHeight(
  year: number | undefined,
  range: { min: number; max: number },
): number {
  if (!year || range.max === range.min) return DEFAULT_H;
  const t = (year - range.min) / (range.max - range.min);
  return Math.round(MIN_H + t * (MAX_H - MIN_H));
}

export function spineWidth(totalPages?: number): number {
  if (!totalPages || totalPages <= 0) return 36;
  return Math.round(26 + Math.min(totalPages / 30, 22));
}

export function spineColor(country: string): string {
  return colorForCountry(country);
}

export interface StatusVisual {
  opacity: number;
  glow: string | null;
}

export function statusVisual(status: ReadingStatus): StatusVisual {
  switch (status) {
    case "want":
      return { opacity: 0.5, glow: null };
    case "reading":
      return {
        opacity: 1,
        glow: "0 0 14px rgba(212, 168, 95, 0.65), 0 0 4px rgba(255, 220, 140, 0.9)",
      };
    case "finished":
      return { opacity: 1, glow: null };
  }
}
