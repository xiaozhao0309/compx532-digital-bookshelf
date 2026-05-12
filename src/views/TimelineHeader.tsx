import { useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { Book } from "../types/book";

export type TimelineAxis = "country" | "category";

interface TimelineHeaderProps {
  books: Book[];
  axis: TimelineAxis;
  onAxisChange: (axis: TimelineAxis) => void;
}

interface HoverState {
  year: number;
  pct: number;
  bookCount: number;
}

export function TimelineHeader({
  books,
  axis,
  onAxisChange,
}: TimelineHeaderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const { ticks, decadeMin, decadeMax, yearCounts } = useMemo(() => {
    const dated = books.filter(
      (b): b is Book => typeof b.publicationYear === "number",
    );
    const minY = dated.length
      ? Math.min(...dated.map((b) => b.publicationYear!))
      : 1900;
    const maxY = dated.length
      ? Math.max(...dated.map((b) => b.publicationYear!))
      : 2025;
    const dMin = Math.floor(minY / 10) * 10;
    const dMax = Math.ceil((maxY + 1) / 10) * 10;
    const ticks: number[] = [];
    for (let y = dMin; y <= dMax; y += 10) ticks.push(y);

    const counts = new Map<number, number>();
    for (const b of dated) {
      counts.set(b.publicationYear!, (counts.get(b.publicationYear!) ?? 0) + 1);
    }

    return { ticks, decadeMin: dMin, decadeMax: dMax, yearCounts: counts };
  }, [books]);

  const span = decadeMax - decadeMin || 1;
  const posOf = (year: number) => ((year - decadeMin) / span) * 100;

  const isMajor = (y: number) =>
    y % 50 === 0 || y === decadeMin || y === decadeMax;

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const pct = (x / rect.width) * 100;
    const exactYear = Math.round(decadeMin + (pct / 100) * span);

    let nearbyCount = 0;
    for (const [yr, count] of yearCounts) {
      if (Math.abs(yr - exactYear) <= 5) nearbyCount += count;
    }

    setHover({ year: exactYear, pct, bookCount: nearbyCount });
  };

  return (
    <div className="timeline-header">
      <div className="timeline-header__top">
        <div>
          <h2>Publication Timeline</h2>
          <p>
            横轴为出版年代（{decadeMin}–{decadeMax}）；每行为一个
            {axis === "country" ? "国家" : "类别"}。鼠标悬停轴线可查看精确年份。
          </p>
        </div>
        <div
          className="view__axis-toggle"
          role="tablist"
          aria-label="时间线 Y 轴"
        >
          <button
            type="button"
            className={`pill ${axis === "country" ? "pill--active" : ""}`}
            onClick={() => onAxisChange("country")}
          >
            按国家
          </button>
          <button
            type="button"
            className={`pill ${axis === "category" ? "pill--active" : ""}`}
            onClick={() => onAxisChange("category")}
          >
            按类别
          </button>
        </div>
      </div>

      <div className="timeline-header__axis-row">
        <div className="timeline-header__axis-label" aria-hidden="true">
          Year
        </div>
        <div
          className="timeline-header__axis-track"
          ref={trackRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((y) => {
            const major = isMajor(y);
            return (
              <span
                key={y}
                className={`timeline-header__tick ${
                  major ? "timeline-header__tick--major" : "timeline-header__tick--minor"
                }`}
                style={{ left: `${posOf(y)}%` }}
              >
                {major && (
                  <span className="timeline-header__tick-label">{y}</span>
                )}
              </span>
            );
          })}

          {hover && (
            <>
              <div
                className="timeline-header__cursor"
                style={{ left: `${hover.pct}%` }}
                aria-hidden="true"
              />
              <div
                className="timeline-header__bubble"
                style={{ left: `${hover.pct}%` }}
                role="tooltip"
              >
                <span className="timeline-header__bubble-year">
                  {hover.year}
                </span>
                {hover.bookCount > 0 && (
                  <span className="timeline-header__bubble-count">
                    ± 5 年内 · {hover.bookCount} 本
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
