import type { ReadingStatus } from "../types/book";
import { READING_STATUS_LABEL, READING_STATUS_OPTIONS } from "../types/book";

export type StatusFilter = ReadingStatus | "all";
export type SortKey = "recent" | "title" | "rating" | "year";

interface ShelfControlsProps {
  query: string;
  onQueryChange: (q: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  visibleCount: number;
  totalCount: number;
  onAdd: () => void;
}

export function ShelfControls({
  query,
  onQueryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  visibleCount,
  totalCount,
  onAdd,
}: ShelfControlsProps) {
  return (
    <div className="shelf-controls">
      <div className="shelf-controls__row">
        <div className="shelf-controls__search">
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="🔍 Search title, author, country, category, or notes…"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          + Add book
        </button>
      </div>

      <div className="shelf-controls__row shelf-controls__row--secondary">
        <div className="pill-group" role="tablist" aria-label="Filter by status">
          <button
            type="button"
            className={`pill ${status === "all" ? "pill--active" : ""}`}
            onClick={() => onStatusChange("all")}
          >
            All
          </button>
          {READING_STATUS_OPTIONS.map((s) => (
            <button
              type="button"
              key={s}
              className={`pill ${status === s ? "pill--active" : ""}`}
              onClick={() => onStatusChange(s)}
            >
              {READING_STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <label className="shelf-controls__select">
          <span className="visually-hidden">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          >
            <option value="title">Sort: Title(A-Z)</option>
            <option value="recent">Sort: Recently updated</option>
            <option value="rating">Sort: Rating</option>
            <option value="year">Sort: Publication year</option>
          </select>
        </label>

        <span className="shelf-controls__summary">
          Showing <strong>{visibleCount}</strong> / {totalCount}
        </span>
      </div>
    </div>
  );
}
