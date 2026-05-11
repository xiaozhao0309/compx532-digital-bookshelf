import type { Book } from "../types/book";
import { READING_STATUS_LABEL, READING_STATUS_OPTIONS } from "../types/book";

export type GroupKey = "country" | "decade" | "category" | "status";

export const GROUPING_LABELS: Record<GroupKey, string> = {
  country: "按作者国家",
  decade: "按出版年代",
  category: "按图书类别",
  status: "按阅读状态",
};

export const GROUPING_ICONS: Record<GroupKey, string> = {
  country: "🌍",
  decade: "📅",
  category: "🏷",
  status: "📖",
};

export interface BookGroup {
  key: string;
  label: string;
  sublabel?: string;
  books: Book[];
}

export function decadeLabel(year?: number): string {
  if (!year || Number.isNaN(year)) return "年代未知";
  const start = Math.floor(year / 10) * 10;
  return `${start}s`;
}

export function groupBooks(books: Book[], by: GroupKey): BookGroup[] {
  const map = new Map<string, Book[]>();

  for (const book of books) {
    const key = groupKey(book, by);
    const arr = map.get(key) ?? [];
    arr.push(book);
    map.set(key, arr);
  }

  const groups: BookGroup[] = [...map.entries()].map(([key, items]) => ({
    key,
    label: groupLabel(key, by),
    sublabel: `${items.length} 本`,
    books: [...items].sort((a, b) => {
      const yearDiff = (b.publicationYear ?? 0) - (a.publicationYear ?? 0);
      if (yearDiff !== 0) return yearDiff;
      return a.title.localeCompare(b.title, "zh-Hans-CN");
    }),
  }));

  if (by === "decade") {
    groups.sort((a, b) => {
      if (a.key === "年代未知") return 1;
      if (b.key === "年代未知") return -1;
      return a.key.localeCompare(b.key);
    });
  } else if (by === "status") {
    const order = READING_STATUS_OPTIONS;
    groups.sort(
      (a, b) =>
        order.indexOf(a.key as (typeof order)[number]) -
        order.indexOf(b.key as (typeof order)[number]),
    );
  } else {
    groups.sort((a, b) => b.books.length - a.books.length);
  }

  return groups;
}

function groupKey(book: Book, by: GroupKey): string {
  switch (by) {
    case "country":
      return book.country?.trim() || "未知";
    case "decade":
      return decadeLabel(book.publicationYear);
    case "category":
      return book.category?.trim() || "未分类";
    case "status":
      return book.status;
  }
}

function groupLabel(key: string, by: GroupKey): string {
  if (by === "status") {
    return READING_STATUS_LABEL[key as keyof typeof READING_STATUS_LABEL] ?? key;
  }
  return key;
}
