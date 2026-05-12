import { useMemo, useState } from "react";
import type { Book } from "../types/book";
import type { BookGroup } from "../utils/grouping";
import { BookSpine } from "./BookSpine";

const BOOKS_PER_SHELF = 20;

interface BookshelfProps {
  groups: BookGroup[];
  onSelect: (book: Book) => void;
  visibleIds: Set<string>;
  selectedId: string | null;
  yearRange: { min: number; max: number };
}

export function Bookshelf({
  groups,
  onSelect,
  visibleIds,
  selectedId,
  yearRange,
}: BookshelfProps) {
  if (groups.length === 0) {
    return (
      <div className="bookshelf-empty">
        <p>书架空空如也，请先添加一本书。</p>
      </div>
    );
  }

  return (
    <div className="bookshelf">
      <div className="bookshelf__wall" aria-hidden="true" />
      {groups.map((group) => (
        <ShelfSection
          key={group.key}
          group={group}
          onSelect={onSelect}
          visibleIds={visibleIds}
          selectedId={selectedId}
          yearRange={yearRange}
        />
      ))}
    </div>
  );
}

interface ShelfSectionProps {
  group: BookGroup;
  onSelect: (book: Book) => void;
  visibleIds: Set<string>;
  selectedId: string | null;
  yearRange: { min: number; max: number };
}

function ShelfSection({
  group,
  onSelect,
  visibleIds,
  selectedId,
  yearRange,
}: ShelfSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const total = group.books.length;
  const hasOverflow = total > BOOKS_PER_SHELF;

  const chunks = useMemo<Book[][]>(() => {
    if (!hasOverflow) return [group.books];
    if (!expanded) return [group.books.slice(0, BOOKS_PER_SHELF)];
    const result: Book[][] = [];
    for (let i = 0; i < total; i += BOOKS_PER_SHELF) {
      result.push(group.books.slice(i, i + BOOKS_PER_SHELF));
    }
    return result;
  }, [group.books, expanded, hasOverflow, total]);

  const visibleCount = group.books.filter((b) => visibleIds.has(b.id)).length;
  const hiddenCount = hasOverflow ? total - BOOKS_PER_SHELF : 0;

  return (
    <section
      className={`shelf ${expanded ? "shelf--expanded" : ""}`}
      aria-labelledby={`shelf-${group.key}`}
    >
      <header className="shelf__header">
        <h3 className="shelf__label" id={`shelf-${group.key}`}>
          {group.label}
        </h3>
        <div className="shelf__head-right">
          <span className="shelf__count">
            {visibleCount === total
              ? `${total} 本`
              : `${visibleCount} / ${total} 本`}
          </span>
          {hasOverflow && (
            <button
              type="button"
              className="shelf__toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              title={expanded ? "收起到一层" : "展开为多层书架"}
            >
              {expanded
                ? "收起 ↑"
                : `展示全部 (+${hiddenCount}) ↓`}
            </button>
          )}
        </div>
      </header>

      <div
        className={`shelf__stack ${
          expanded ? "shelf__stack--scroll" : ""
        }`}
      >
        {chunks.map((chunk, i) => (
          <div className="shelf__row" key={i}>
            <div className="shelf__board" role="list">
              {chunk.map((book) => (
                <BookSpine
                  key={book.id}
                  book={book}
                  yearRange={yearRange}
                  onSelect={onSelect}
                  dim={!visibleIds.has(book.id)}
                  selected={book.id === selectedId}
                />
              ))}
            </div>
            <div className="shelf__plank" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
