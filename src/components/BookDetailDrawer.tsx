import { useEffect, useMemo } from "react";
import type { Book } from "../types/book";
import { READING_STATUS_LABEL } from "../types/book";
import { colorForCountry } from "../utils/countries";
import { decadeLabel } from "../utils/grouping";
import { StarRating } from "./StarRating";

interface BookDetailDrawerProps {
  book: Book | null;
  allBooks: Book[];
  yearRange: { min: number; max: number };
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onRate: (book: Book, rating: number) => void;
  onNotesChange: (book: Book, notes: string) => void;
}

export function BookDetailDrawer({
  book,
  allBooks,
  yearRange,
  onClose,
  onEdit,
  onDelete,
  onRate,
  onNotesChange,
}: BookDetailDrawerProps) {
  useEffect(() => {
    if (!book) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [book, onClose]);

  const context = useMemo(() => {
    if (!book) return null;
    const sameCountry = allBooks.filter(
      (b) => b.country === book.country,
    );
    const sameCategory = allBooks.filter(
      (b) => b.category === book.category,
    );
    const sameDecade = allBooks.filter(
      (b) => decadeLabel(b.publicationYear) === decadeLabel(book.publicationYear),
    );
    return {
      countryRank: sortedRank(
        sameCountry.sort(
          (a, b) => (a.publicationYear ?? 0) - (b.publicationYear ?? 0),
        ),
        book.id,
      ),
      countryTotal: sameCountry.length,
      categoryTotal: sameCategory.length,
      decadeTotal: sameDecade.length,
    };
  }, [book, allBooks]);

  if (!book) return null;

  const heroColor = colorForCountry(book.country);
  const progress =
    book.totalPages && book.totalPages > 0
      ? Math.min(100, Math.round(((book.currentPage ?? 0) / book.totalPages) * 100))
      : null;
  const yearPosition =
    book.publicationYear && yearRange.max !== yearRange.min
      ? Math.round(
          ((book.publicationYear - yearRange.min) /
            (yearRange.max - yearRange.min)) *
            100,
        )
      : null;

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer__hero" style={{ backgroundColor: heroColor }}>
          <div className="drawer__hero-actions">
            <button
              type="button"
              className="drawer__icon-btn"
              onClick={() => onEdit(book)}
              aria-label="Edit"
              title="Edit all fields"
            >
              ✎
            </button>
            <button
              type="button"
              className="drawer__icon-btn"
              onClick={() => onDelete(book)}
              aria-label="Delete"
              title="Remove from shelf"
            >
              🗑
            </button>
            <button
              type="button"
              className="drawer__icon-btn"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
          </div>

          <span className="drawer__country-tag">{book.country || "Unknown"}</span>
          <span className="drawer__category-chip">
            {book.category || "Uncategorized"}
          </span>
          <h2 id="drawer-title" className="drawer__title">
            {book.title}
          </h2>
          <p className="drawer__author">
            {book.author || "Unknown author"}
            {book.publicationYear && (
              <>
                {" · "}
                <span>{book.publicationYear}</span>
              </>
            )}
          </p>
        </div>

        <div className="drawer__body">
          <section className="drawer__section">
            <h3 className="drawer__section-title">At a glance</h3>
            <dl className="drawer__facts">
              <Fact label="Country" value={book.country || "—"} />
              <Fact
                label="Pub. year"
                value={book.publicationYear ? String(book.publicationYear) : "—"}
              />
              <Fact label="Status" value={READING_STATUS_LABEL[book.status]} />
              <Fact
                label="Pages"
                value={book.totalPages ? `${book.totalPages}` : "—"}
              />
            </dl>
          </section>

          {context && (
            <section className="drawer__section">
              <h3 className="drawer__section-title">In your collection</h3>
              <ul className="drawer__context">
                <li>
                  <strong>
                    {context.countryRank}/{context.countryTotal}
                  </strong>
                  <span>by year, from {book.country}</span>
                </li>
                <li>
                  <strong>{context.decadeTotal}</strong>
                  <span>
                    in {decadeLabel(book.publicationYear)}
                  </span>
                </li>
                <li>
                  <strong>{context.categoryTotal}</strong>
                  <span>in {book.category || "Uncategorized"}</span>
                </li>
              </ul>
            </section>
          )}

          {yearPosition !== null && (
            <section className="drawer__section">
              <h3 className="drawer__section-title">Year position</h3>
              <div className="drawer__year-bar">
                <span className="drawer__year-edge">{yearRange.min}</span>
                <div className="drawer__year-track">
                  <div
                    className="drawer__year-marker"
                    style={{ left: `${yearPosition}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="drawer__year-edge">{yearRange.max}</span>
              </div>
            </section>
          )}

          {progress !== null && (
            <section className="drawer__section">
              <h3 className="drawer__section-title">Reading progress</h3>
              <div className="drawer__progress-head">
                <span>
                  {book.currentPage ?? 0} / {book.totalPages} pages
                </span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>
          )}

          <section className="drawer__section">
            <h3 className="drawer__section-title">Your rating</h3>
            <StarRating
              value={book.rating}
              onChange={(v) => onRate(book, v)}
              size={28}
            />
          </section>

          <section className="drawer__section drawer__section--notes">
            <h3 className="drawer__section-title">Reading notes</h3>
            <div className="drawer__notes-wrap">
              <span className="drawer__quote" aria-hidden="true">
                "
              </span>
              <textarea
                className="drawer__notes"
                value={book.notes}
                onChange={(e) => onNotesChange(book, e.target.value)}
                rows={5}
                placeholder="Write your thoughts, quotes, or excerpts…"
              />
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="drawer__fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function sortedRank(sorted: Book[], targetId: string): number {
  return sorted.findIndex((b) => b.id === targetId) + 1;
}
