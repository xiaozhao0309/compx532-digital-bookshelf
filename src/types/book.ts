export type ReadingStatus = "want" | "reading" | "finished";

export const READING_STATUS_LABEL: Record<ReadingStatus, string> = {
  want: "想读",
  reading: "在读",
  finished: "已读",
};

export const READING_STATUS_OPTIONS: ReadingStatus[] = [
  "want",
  "reading",
  "finished",
];

export const READING_STATUS_COLOR: Record<ReadingStatus, string> = {
  want: "#8B8FA3",
  reading: "#5B6CFF",
  finished: "#2FAA6A",
};

export interface Book {
  id: string;
  title: string;
  author: string;
  country: string;
  publicationYear?: number;
  category: string;
  coverUrl?: string;
  totalPages?: number;
  currentPage?: number;
  status: ReadingStatus;
  rating: number;
  notes: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export type BookDraft = Omit<Book, "id" | "createdAt" | "updatedAt">;
