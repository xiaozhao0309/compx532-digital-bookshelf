import type { Book } from "../types/book";
import { SAMPLE_BOOKS } from "../data/sampleBooks";

const STORAGE_KEY = "digital-bookshelf:books:v6";
const LEGACY_KEYS = [
  "digital-bookshelf:books:v1",
  "digital-bookshelf:books:v2",
  "digital-bookshelf:books:v3",
  "digital-bookshelf:books:v4",
  "digital-bookshelf:books:v5",
];

const DAY = 86_400_000;

export function loadBooks(): Book[] {
  try {
    for (const k of LEGACY_KEYS) localStorage.removeItem(k);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBooks();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedBooks();
    return parsed.map(migrateBook);
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function migrateBook(raw: Partial<Book>): Book {
  return {
    country: "Unknown",
    publicationYear: undefined,
    coverUrl: undefined,
    totalPages: undefined,
    currentPage: 0,
    rating: 0,
    notes: "",
    status: "want",
    category: "Uncategorized",
    author: "",
    title: "",
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...raw,
  } as Book;
}

function seedBooks(): Book[] {
  const now = Date.now();
  const books: Book[] = SAMPLE_BOOKS.map((draft, i) => {
    const created = now - i * DAY;
    let startedAt: number | undefined;
    let finishedAt: number | undefined;

    if (draft.status === "reading") {
      startedAt = now - (10 + (i % 40)) * DAY;
    } else if (draft.status === "finished") {
      const finishedDaysAgo = 30 + (i * 17) % 300;
      finishedAt = now - finishedDaysAgo * DAY;
      startedAt = finishedAt - (45 + (i * 7) % 90) * DAY;
    }

    return {
      ...draft,
      currentPage: draft.currentPage ?? 0,
      notes: draft.notes ?? "",
      id: generateId(),
      createdAt: created,
      updatedAt: created,
      startedAt: draft.startedAt ?? startedAt,
      finishedAt: draft.finishedAt ?? finishedAt,
    };
  });
  saveBooks(books);
  return books;
}
