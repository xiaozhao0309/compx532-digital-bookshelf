import { useCallback, useEffect, useMemo, useState } from "react";
import type { Book, BookDraft } from "../types/book";
import { generateId, loadBooks, saveBooks } from "../utils/storage";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(() => loadBooks());

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  const addBook = useCallback((draft: BookDraft) => {
    const now = Date.now();
    const book: Book = {
      ...draft,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setBooks((prev) => [book, ...prev]);
    return book;
  }, []);

  const updateBook = useCallback((id: string, patch: Partial<BookDraft>) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...patch, updatedAt: Date.now() } : b,
      ),
    );
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = books.length;
    const reading = books.filter((b) => b.status === "reading").length;
    const finished = books.filter((b) => b.status === "finished").length;
    const want = books.filter((b) => b.status === "want").length;
    const totalPagesRead = books.reduce(
      (sum, b) => sum + (b.currentPage ?? 0),
      0,
    );
    return { total, reading, finished, want, totalPagesRead };
  }, [books]);

  return { books, addBook, updateBook, deleteBook, stats };
}
