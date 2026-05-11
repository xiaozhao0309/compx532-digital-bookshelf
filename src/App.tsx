import { useMemo, useState } from "react";
import { useBooks } from "./hooks/useBooks";
import { Hero } from "./components/Hero";
import { BookDetailDrawer } from "./components/BookDetailDrawer";
import { BookForm } from "./components/BookForm";
import { Modal } from "./components/Modal";
import {
  ViewModeSwitcher,
  type ViewMode,
} from "./components/ViewModeSwitcher";
import {
  ShelfControls,
  type SortKey,
  type StatusFilter,
} from "./components/ShelfControls";
import { BookshelfView } from "./views/BookshelfView";
import { TimelineView } from "./views/TimelineView";
import { StatisticsView } from "./views/StatisticsView";
import { WorldView } from "./views/WorldView";
import { type GroupKey, decadeLabel } from "./utils/grouping";
import { heroKpis } from "./utils/stats";
import { yearRange } from "./utils/encoding";
import type { Focus } from "./App.types";
import type { Book, BookDraft } from "./types/book";
import "./App.css";

export default function App() {
  const { books, addBook, updateBook, deleteBook } = useBooks();

  const [viewMode, setViewMode] = useState<ViewMode>("bookshelf");
  const [groupBy, setGroupBy] = useState<GroupKey>("country");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [focus, setFocus] = useState<Focus | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedId) ?? null,
    [books, selectedId],
  );
  const editingBook = useMemo(
    () => books.find((b) => b.id === editingId) ?? null,
    [books, editingId],
  );

  const sortedBooks = useMemo(() => {
    const arr = [...books];
    if (sort === "title") {
      arr.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
    } else if (sort === "rating") {
      arr.sort((a, b) => b.rating - a.rating || b.updatedAt - a.updatedAt);
    } else if (sort === "year") {
      arr.sort(
        (a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0),
      );
    } else {
      arr.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return arr;
  }, [books, sort]);

  const visibleIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ids = new Set<string>();
    for (const b of books) {
      if (statusFilter !== "all" && b.status !== statusFilter) continue;
      if (focus) {
        if (focus.dim === "country" && (b.country || "未知") !== focus.value)
          continue;
        if (focus.dim === "category" && (b.category || "未分类") !== focus.value)
          continue;
        if (focus.dim === "decade" && decadeLabel(b.publicationYear) !== focus.value)
          continue;
        if (focus.dim === "status" && b.status !== focus.value) continue;
      }
      if (q) {
        const hay = [
          b.title,
          b.author,
          b.country,
          b.category,
          b.notes,
          String(b.publicationYear ?? ""),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) continue;
      }
      ids.add(b.id);
    }
    return ids;
  }, [books, query, statusFilter, focus]);

  const range = useMemo(() => yearRange(books), [books]);
  const kpis = useMemo(() => heroKpis(books), [books]);

  const handleDelete = (book: Book) => {
    const ok = window.confirm(`确定要从书架上删除《${book.title}》吗？`);
    if (!ok) return;
    deleteBook(book.id);
    if (selectedId === book.id) setSelectedId(null);
    if (editingId === book.id) setEditingId(null);
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setSelectedId(null);
  };

  const handleSubmitAdd = (draft: BookDraft) => {
    addBook(draft);
    setAddingNew(false);
  };

  const handleSubmitEdit = (draft: BookDraft) => {
    if (!editingId) return;
    updateBook(editingId, draft);
    setEditingId(null);
  };

  const focusLabel = focus
    ? {
        country: "国家",
        category: "类别",
        decade: "年代",
        status: "状态",
      }[focus.dim]
    : null;

  return (
    <div className="app">
      <main className="app__main">
        <Hero kpis={kpis} />

        <ViewModeSwitcher value={viewMode} onChange={setViewMode} />

        <div className="global-toolbar">
          <ShelfControls
            query={query}
            onQueryChange={setQuery}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            sort={sort}
            onSortChange={setSort}
            visibleCount={visibleIds.size}
            totalCount={books.length}
            onAdd={() => setAddingNew(true)}
          />
          {focus && (
            <div className="focus-chip" role="status" aria-live="polite">
              <span className="focus-chip__icon" aria-hidden="true">
                🎯
              </span>
              <span>
                焦点：<strong>{focusLabel}</strong> = {focus.value}
              </span>
              <button
                type="button"
                className="focus-chip__clear"
                onClick={() => setFocus(null)}
                aria-label="清除焦点"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <section className="view-stage">
          {viewMode === "bookshelf" && (
            <BookshelfView
              books={sortedBooks}
              groupBy={groupBy}
              onGroupChange={setGroupBy}
              visibleIds={visibleIds}
              selectedId={selectedId}
              onSelectBook={(b) => setSelectedId(b.id)}
              yearRange={range}
            />
          )}
          {viewMode === "timeline" && (
            <TimelineView
              books={sortedBooks}
              visibleIds={visibleIds}
              selectedId={selectedId}
              onSelectBook={(b) => setSelectedId(b.id)}
              yearRange={range}
            />
          )}
          {viewMode === "statistics" && (
            <StatisticsView books={books} focus={focus} onFocus={setFocus} />
          )}
          {viewMode === "world" && (
            <WorldView
              books={sortedBooks}
              visibleIds={visibleIds}
              selectedId={selectedId}
              onSelectBook={(b) => setSelectedId(b.id)}
              yearRange={range}
            />
          )}
        </section>
      </main>

      <footer className="app__footer">
        <span>
          Digital Bookshelf · COMPX532 Information Visualization · University of
          Waikato
        </span>
      </footer>

      <BookDetailDrawer
        book={selectedBook}
        allBooks={books}
        yearRange={range}
        onClose={() => setSelectedId(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRate={(book, rating) => updateBook(book.id, { rating })}
        onNotesChange={(book, notes) => updateBook(book.id, { notes })}
      />

      <Modal open={addingNew} onClose={() => setAddingNew(false)}>
        <BookForm
          onSubmit={handleSubmitAdd}
          onCancel={() => setAddingNew(false)}
        />
      </Modal>

      <Modal
        open={editingBook !== null}
        onClose={() => setEditingId(null)}
      >
        {editingBook && (
          <BookForm
            initial={editingBook}
            onSubmit={handleSubmitEdit}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
