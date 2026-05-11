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
            placeholder="🔍 搜索书名、作者、国家、类别或笔记…"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          + 添加新书
        </button>
      </div>

      <div className="shelf-controls__row shelf-controls__row--secondary">
        <div className="pill-group" role="tablist" aria-label="按状态筛选">
          <button
            type="button"
            className={`pill ${status === "all" ? "pill--active" : ""}`}
            onClick={() => onStatusChange("all")}
          >
            全部
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
          <span className="visually-hidden">排序</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          >
            <option value="recent">排序：最近更新</option>
            <option value="title">排序：书名</option>
            <option value="rating">排序：评分</option>
            <option value="year">排序：出版年</option>
          </select>
        </label>

        <span className="shelf-controls__summary">
          显示 <strong>{visibleCount}</strong> / {totalCount} 本
        </span>
      </div>
    </div>
  );
}
