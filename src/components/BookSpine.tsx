import type { CSSProperties } from "react";
import type { Book } from "../types/book";
import {
  spineColor,
  spineHeight,
  spineWidth,
  statusVisual,
} from "../utils/encoding";

interface BookSpineProps {
  book: Book;
  yearRange: { min: number; max: number };
  onSelect: (book: Book) => void;
  dim?: boolean;
  selected?: boolean;
  compact?: boolean;
}

export function BookSpine({
  book,
  yearRange,
  onSelect,
  dim = false,
  selected = false,
  compact = false,
}: BookSpineProps) {
  const color = spineColor(book.country);
  const baseWidth = spineWidth(book.totalPages);
  const baseHeight = spineHeight(book.publicationYear, yearRange);
  const width = compact ? Math.round(baseWidth * 0.7) : baseWidth;
  const height = compact ? Math.round(baseHeight * 0.7) : baseHeight;
  const status = statusVisual(book.status);

  const yearTag = book.publicationYear ? `${book.publicationYear}` : "—";

  const classes = [
    "book-spine",
    `book-spine--${book.status}`,
    dim && "book-spine--dim",
    selected && "book-spine--selected",
    compact && "book-spine--compact",
  ]
    .filter(Boolean)
    .join(" ");

  const styleVars: CSSProperties = {
    width,
    height,
    backgroundColor: color,
    opacity: dim ? undefined : status.opacity,
    boxShadow: status.glow ?? undefined,
  };

  return (
    <button
      type="button"
      className={classes}
      style={styleVars}
      onClick={() => onSelect(book)}
      aria-label={`${book.title} · ${book.author} · ${yearTag}`}
      aria-pressed={selected}
      title={`${book.title} — ${book.author} (${book.country || "Unknown"}, ${yearTag})`}
    >
      <span className="book-spine__accent" aria-hidden="true" />

      {book.rating > 0 && !compact && (
        <span
          className="book-spine__rating"
          aria-label={`Rating ${book.rating} / 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`book-spine__rating-dot ${
                i < book.rating ? "book-spine__rating-dot--on" : ""
              }`}
            />
          ))}
        </span>
      )}

      <span className="book-spine__title">{book.title}</span>

      {!compact && (
        <span className="book-spine__foot" aria-hidden="true">
          {yearTag}
        </span>
      )}
    </button>
  );
}
