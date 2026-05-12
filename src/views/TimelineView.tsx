import { useMemo } from "react";
import type { Book } from "../types/book";
import { BookSpine } from "../components/BookSpine";
import { flagFor } from "../utils/countries";
import type { TimelineAxis } from "./TimelineHeader";

interface TimelineViewProps {
  books: Book[];
  axis: TimelineAxis;
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelectBook: (book: Book) => void;
  yearRange: { min: number; max: number };
}

export function TimelineView({
  books,
  axis,
  visibleIds,
  selectedId,
  onSelectBook,
  yearRange,
}: TimelineViewProps) {
  const { rows, ticks, decadeMin, decadeMax } = useMemo(() => {
    const dated = books.filter(
      (b): b is Book => typeof b.publicationYear === "number",
    );
    const minY = dated.length
      ? Math.min(...dated.map((b) => b.publicationYear!))
      : yearRange.min;
    const maxY = dated.length
      ? Math.max(...dated.map((b) => b.publicationYear!))
      : yearRange.max;
    const dMin = Math.floor(minY / 10) * 10;
    const dMax = Math.ceil((maxY + 1) / 10) * 10;

    const byKey = new Map<string, Book[]>();
    for (const b of dated) {
      const key =
        axis === "country"
          ? b.country || "Unknown"
          : b.category || "Uncategorized";
      const arr = byKey.get(key) ?? [];
      arr.push(b);
      byKey.set(key, arr);
    }
    const rows = [...byKey.entries()]
      .map(([key, items]) => ({ key, items }))
      .sort((a, b) => b.items.length - a.items.length);

    const ticks: number[] = [];
    for (let y = dMin; y <= dMax; y += 10) ticks.push(y);

    return { rows, ticks, decadeMin: dMin, decadeMax: dMax };
  }, [books, axis, yearRange]);

  const undatedCount = books.filter((b) => !b.publicationYear).length;
  const span = decadeMax - decadeMin || 1;
  const posOf = (year: number) => ((year - decadeMin) / span) * 100;

  return (
    <div className="view view--timeline">
      <div className="timeline">
        <div className="timeline__rows">
          {rows.length === 0 && (
            <p className="view__empty">
              No books with a known publication year to display.
            </p>
          )}
          {rows.map((row) => (
            <div className="timeline__row" key={row.key}>
              <div className="timeline__row-label">
                {axis === "country" && (
                  <span className="timeline__flag" aria-hidden="true">
                    {flagFor(row.key)}
                  </span>
                )}
                <span className="timeline__row-name">{row.key}</span>
                <span className="timeline__row-count">{row.items.length}</span>
              </div>
              <div className="timeline__track">
                <div className="timeline__grid" aria-hidden="true">
                  {ticks.map((y) => (
                    <span
                      key={y}
                      className="timeline__gridline"
                      style={{ left: `${posOf(y)}%` }}
                    />
                  ))}
                </div>
                {row.items.map((book) => (
                  <div
                    key={book.id}
                    className="timeline__book"
                    style={{ left: `${posOf(book.publicationYear!)}%` }}
                  >
                    <BookSpine
                      book={book}
                      yearRange={yearRange}
                      onSelect={onSelectBook}
                      dim={!visibleIds.has(book.id)}
                      selected={book.id === selectedId}
                      compact
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {undatedCount > 0 && (
          <p className="timeline__caveat">
            Note: {undatedCount} {undatedCount === 1 ? "book is" : "books are"}{" "}
            not shown on the timeline because of a missing publication year.
          </p>
        )}
      </div>
    </div>
  );
}
