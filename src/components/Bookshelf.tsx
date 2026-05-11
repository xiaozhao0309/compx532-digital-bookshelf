import type { Book } from "../types/book";
import type { BookGroup } from "../utils/grouping";
import { BookSpine } from "./BookSpine";

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
      {groups.map((group) => {
        const visibleCount = group.books.filter((b) =>
          visibleIds.has(b.id),
        ).length;
        return (
          <section
            key={group.key}
            className="shelf"
            aria-labelledby={`shelf-${group.key}`}
          >
            <header className="shelf__header">
              <h3 className="shelf__label" id={`shelf-${group.key}`}>
                {group.label}
              </h3>
              <span className="shelf__count">
                {visibleCount === group.books.length
                  ? `${group.books.length} 本`
                  : `${visibleCount} / ${group.books.length} 本`}
              </span>
            </header>
            <div className="shelf__board" role="list">
              {group.books.map((book) => (
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
          </section>
        );
      })}
    </div>
  );
}
