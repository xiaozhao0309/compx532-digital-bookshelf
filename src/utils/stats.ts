import type { Book, ReadingStatus } from "../types/book";
import { decadeLabel } from "./grouping";

export interface CountEntry {
  key: string;
  count: number;
}

function countBy<T>(items: T[], keyFn: (t: T) => string): CountEntry[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = keyFn(it);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function countriesOf(books: Book[]): CountEntry[] {
  return countBy(books, (b) => b.country?.trim() || "未知");
}

export function categoriesOf(books: Book[]): CountEntry[] {
  return countBy(books, (b) => b.category?.trim() || "未分类");
}

export function decadesOf(books: Book[]): CountEntry[] {
  const entries = countBy(books, (b) => decadeLabel(b.publicationYear));
  return entries.sort((a, b) => {
    if (a.key === "年代未知") return 1;
    if (b.key === "年代未知") return -1;
    return a.key.localeCompare(b.key);
  });
}

export function statusBreakdown(books: Book[]): Record<ReadingStatus, number> {
  const result: Record<ReadingStatus, number> = {
    want: 0,
    reading: 0,
    finished: 0,
  };
  for (const b of books) result[b.status]++;
  return result;
}

export interface HeroKpis {
  total: number;
  countries: number;
  yearSpan: string;
  finishedRate: string;
}

export function heroKpis(books: Book[]): HeroKpis {
  const total = books.length;
  const countries = new Set(
    books.map((b) => b.country?.trim() || "未知"),
  ).size;
  const years = books
    .map((b) => b.publicationYear)
    .filter((y): y is number => typeof y === "number");
  const yearSpan =
    years.length === 0
      ? "—"
      : `${Math.min(...years)} – ${Math.max(...years)}`;
  const finished = books.filter((b) => b.status === "finished").length;
  const finishedRate =
    total === 0 ? "0%" : `${Math.round((finished / total) * 100)}%`;
  return { total, countries, yearSpan, finishedRate };
}
