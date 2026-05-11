import { useMemo, useState } from "react";
import type { Book } from "../types/book";
import { BookSpine } from "../components/BookSpine";
import { flagFor } from "../utils/countries";

type Axis = "country" | "category";

interface TimelineViewProps {
  books: Book[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelectBook: (book: Book) => void;
  yearRange: { min: number; max: number };
}

export function TimelineView({
  books,
  visibleIds,
  selectedId,
  onSelectBook,
  yearRange,
}: TimelineViewProps) {
  const [axis, setAxis] = useState<Axis>("country");

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
        axis === "country" ? b.country || "未知" : b.category || "未分类";
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
      <header className="view__head">
        <div>
          <h2>Publication Timeline</h2>
          <p>
            横轴为出版年代（{decadeMin}–{decadeMax}）；每行为一个
            {axis === "country" ? "国家" : "类别"}。
          </p>
        </div>
        <div className="view__axis-toggle" role="tablist" aria-label="时间线 Y 轴">
          <button
            type="button"
            className={`pill ${axis === "country" ? "pill--active" : ""}`}
            onClick={() => setAxis("country")}
          >
            按国家
          </button>
          <button
            type="button"
            className={`pill ${axis === "category" ? "pill--active" : ""}`}
            onClick={() => setAxis("category")}
          >
            按类别
          </button>
        </div>
      </header>

      <div className="timeline">
        <div className="timeline__rows">
          {rows.length === 0 && (
            <p className="view__empty">没有可显示的图书（缺少出版年）。</p>
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

        <div className="timeline__axis" aria-hidden="true">
          {ticks.map((y) => (
            <span
              key={y}
              className="timeline__tick"
              style={{ left: `${posOf(y)}%` }}
            >
              {y}
            </span>
          ))}
        </div>

        {undatedCount > 0 && (
          <p className="timeline__caveat">
            注：{undatedCount} 本图书因缺少出版年未显示在时间线上。
          </p>
        )}
      </div>
    </div>
  );
}
