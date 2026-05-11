import { useMemo } from "react";
import type { Book } from "../types/book";
import { READING_STATUS_COLOR, READING_STATUS_LABEL } from "../types/book";
import {
  categoriesOf,
  countriesOf,
  decadesOf,
  statusBreakdown,
  type CountEntry,
} from "../utils/stats";
import { colorForCountry } from "../utils/countries";
import type { Focus, FocusDim } from "../App.types";

interface StatisticsViewProps {
  books: Book[];
  focus: Focus | null;
  onFocus: (focus: Focus | null) => void;
}

export function StatisticsView({ books, focus, onFocus }: StatisticsViewProps) {
  const countries = useMemo(() => countriesOf(books), [books]);
  const categories = useMemo(() => categoriesOf(books), [books]);
  const decades = useMemo(() => decadesOf(books), [books]);
  const statusCounts = useMemo(() => statusBreakdown(books), [books]);

  const pagesBuckets = useMemo(() => buildPagesBuckets(books), [books]);
  const ratingByStatus = useMemo(() => buildRatingByStatus(books), [books]);

  const toggle = (dim: FocusDim, value: string) => {
    if (focus && focus.dim === dim && focus.value === value) {
      onFocus(null);
    } else {
      onFocus({ dim, value });
    }
  };

  return (
    <div className="view view--statistics">
      <header className="view__head">
        <div>
          <h2>Collection Statistics</h2>
          <p>
            点击任一条目高亮全局对应图书；再次点击或点顶部 × 可清除焦点。
          </p>
        </div>
      </header>

      <div className="stats-grid">
        <article className="stats-card stats-card--span-2">
          <h3>国家分布</h3>
          <p className="stats-card__sub">Top 10 by count · 颜色 = 国家</p>
          <InteractiveBars
            entries={countries.slice(0, 10)}
            getColor={(key) => colorForCountry(key)}
            isActive={(key) => focus?.dim === "country" && focus.value === key}
            onClick={(key) => toggle("country", key)}
            unit="本"
          />
        </article>

        <article className="stats-card stats-card--span-2">
          <h3>类别数量</h3>
          <p className="stats-card__sub">Top 10 by count</p>
          <InteractiveBars
            entries={categories.slice(0, 10)}
            isActive={(key) => focus?.dim === "category" && focus.value === key}
            onClick={(key) => toggle("category", key)}
            accent="var(--accent)"
            unit="本"
          />
        </article>

        <article className="stats-card stats-card--span-2">
          <h3>出版年代趋势</h3>
          <p className="stats-card__sub">按 10 年分桶</p>
          <DecadeHistogram
            entries={decades}
            isActive={(key) => focus?.dim === "decade" && focus.value === key}
            onClick={(key) => toggle("decade", key)}
          />
        </article>

        <article className="stats-card">
          <h3>阅读状态</h3>
          <p className="stats-card__sub">want / reading / finished</p>
          <BigDonut
            counts={statusCounts}
            activeStatus={
              focus?.dim === "status"
                ? (focus.value as "want" | "reading" | "finished")
                : null
            }
            onClick={(key) => toggle("status", key)}
          />
        </article>

        <article className="stats-card">
          <h3>页数分布</h3>
          <p className="stats-card__sub">按厚度分桶</p>
          <PagesHistogram entries={pagesBuckets} />
        </article>

        <article className="stats-card">
          <h3>各状态平均评分</h3>
          <p className="stats-card__sub">0–5 stars</p>
          <RatingBars entries={ratingByStatus} />
        </article>
      </div>
    </div>
  );
}

interface BarProps {
  entries: CountEntry[];
  isActive: (key: string) => boolean;
  onClick: (key: string) => void;
  getColor?: (key: string) => string;
  accent?: string;
  unit?: string;
}

function InteractiveBars({
  entries,
  isActive,
  onClick,
  getColor,
  accent = "var(--wood)",
  unit = "",
}: BarProps) {
  const max = entries.reduce((m, e) => Math.max(m, e.count), 0) || 1;
  if (entries.length === 0) return <p className="stats-card__empty">暂无数据</p>;
  return (
    <ul className="ibars">
      {entries.map((e) => {
        const active = isActive(e.key);
        const color = getColor ? getColor(e.key) : accent;
        return (
          <li key={e.key} className={`ibars__row ${active ? "ibars__row--active" : ""}`}>
            <button
              type="button"
              className="ibars__btn"
              onClick={() => onClick(e.key)}
              aria-pressed={active}
            >
              <span className="ibars__label">{e.key}</span>
              <span className="ibars__track">
                <span
                  className="ibars__fill"
                  style={{
                    width: `${(e.count / max) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </span>
              <span className="ibars__count">
                {e.count}
                {unit && <small> {unit}</small>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface DecadeProps {
  entries: CountEntry[];
  isActive: (key: string) => boolean;
  onClick: (key: string) => void;
}

function DecadeHistogram({ entries, isActive, onClick }: DecadeProps) {
  const datedEntries = entries.filter((e) => e.key !== "年代未知");
  if (datedEntries.length === 0)
    return <p className="stats-card__empty">暂无数据</p>;

  const decades: CountEntry[] = [];
  const decadeNums = datedEntries
    .map((e) => parseInt(e.key, 10))
    .filter((n) => !Number.isNaN(n));
  const minD = Math.min(...decadeNums);
  const maxD = Math.max(...decadeNums);
  const lookup = new Map(datedEntries.map((e) => [e.key, e.count]));
  for (let d = minD; d <= maxD; d += 10) {
    const key = `${d}s`;
    decades.push({ key, count: lookup.get(key) ?? 0 });
  }

  const max = decades.reduce((m, e) => Math.max(m, e.count), 0) || 1;

  return (
    <div className="decade-hist">
      {decades.map((e) => {
        const active = isActive(e.key);
        const heightPct = (e.count / max) * 100;
        return (
          <button
            type="button"
            key={e.key}
            className={`decade-hist__col ${
              active ? "decade-hist__col--active" : ""
            }`}
            onClick={() => onClick(e.key)}
            aria-pressed={active}
            title={`${e.key}：${e.count} 本`}
          >
            <span className="decade-hist__count">{e.count || ""}</span>
            <span
              className="decade-hist__bar"
              style={{ height: e.count === 0 ? "2px" : `${heightPct}%` }}
            />
            <span className="decade-hist__label">{e.key}</span>
          </button>
        );
      })}
    </div>
  );
}

interface DonutProps {
  counts: Record<"want" | "reading" | "finished", number>;
  activeStatus: "want" | "reading" | "finished" | null;
  onClick: (status: string) => void;
}

function BigDonut({ counts, activeStatus, onClick }: DonutProps) {
  const total = counts.want + counts.reading + counts.finished;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = (["reading", "want", "finished"] as const).map((key) => {
    const value = counts[key];
    const length = total === 0 ? 0 : (value / total) * circumference;
    const seg = {
      key,
      color: READING_STATUS_COLOR[key],
      length,
      offset,
      value,
    };
    offset += length;
    return seg;
  });

  if (total === 0) return <p className="stats-card__empty">暂无数据</p>;

  return (
    <div className="big-donut">
      <svg viewBox="0 0 160 160" className="big-donut__svg">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="18"
        />
        {segments.map((s) => {
          const active = activeStatus === s.key;
          return (
            <circle
              key={s.key}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={active ? 22 : 18}
              strokeDasharray={`${s.length} ${circumference - s.length}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 80 80)"
              style={{
                cursor: "pointer",
                opacity: activeStatus && !active ? 0.35 : 1,
                transition:
                  "stroke-width 0.2s ease, opacity 0.2s ease",
              }}
              onClick={() => onClick(s.key)}
            />
          );
        })}
        <text x="80" y="78" textAnchor="middle" className="big-donut__total">
          {total}
        </text>
        <text
          x="80"
          y="96"
          textAnchor="middle"
          className="big-donut__total-label"
        >
          books
        </text>
      </svg>
      <ul className="big-donut__legend">
        {(["reading", "want", "finished"] as const).map((key) => {
          const active = activeStatus === key;
          return (
            <li key={key}>
              <button
                type="button"
                className={`big-donut__legend-row ${
                  active ? "big-donut__legend-row--active" : ""
                }`}
                onClick={() => onClick(key)}
                aria-pressed={active}
              >
                <span
                  className="big-donut__swatch"
                  style={{ backgroundColor: READING_STATUS_COLOR[key] }}
                />
                <span className="big-donut__legend-label">
                  {READING_STATUS_LABEL[key]}
                </span>
                <span className="big-donut__legend-count">
                  {counts[key]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function buildPagesBuckets(books: Book[]): CountEntry[] {
  const buckets: CountEntry[] = [
    { key: "< 200", count: 0 },
    { key: "200–399", count: 0 },
    { key: "400–599", count: 0 },
    { key: "600–999", count: 0 },
    { key: "1000+", count: 0 },
    { key: "未知", count: 0 },
  ];
  for (const b of books) {
    const p = b.totalPages;
    if (!p) buckets[5].count++;
    else if (p < 200) buckets[0].count++;
    else if (p < 400) buckets[1].count++;
    else if (p < 600) buckets[2].count++;
    else if (p < 1000) buckets[3].count++;
    else buckets[4].count++;
  }
  return buckets;
}

function PagesHistogram({ entries }: { entries: CountEntry[] }) {
  const max = entries.reduce((m, e) => Math.max(m, e.count), 0) || 1;
  return (
    <div className="decade-hist">
      {entries.map((e) => (
        <div key={e.key} className="decade-hist__col">
          <span className="decade-hist__count">{e.count || ""}</span>
          <span
            className="decade-hist__bar"
            style={{
              height: e.count === 0 ? "2px" : `${(e.count / max) * 100}%`,
              background:
                "linear-gradient(180deg, var(--primary) 0%, var(--wood) 100%)",
            }}
          />
          <span className="decade-hist__label">{e.key}</span>
        </div>
      ))}
    </div>
  );
}

interface RatingEntry {
  key: "want" | "reading" | "finished";
  avg: number;
  count: number;
}

function buildRatingByStatus(books: Book[]): RatingEntry[] {
  const keys: Array<"want" | "reading" | "finished"> = [
    "want",
    "reading",
    "finished",
  ];
  return keys.map((key) => {
    const subset = books.filter((b) => b.status === key && b.rating > 0);
    const avg = subset.length
      ? subset.reduce((s, b) => s + b.rating, 0) / subset.length
      : 0;
    return { key, avg, count: subset.length };
  });
}

function RatingBars({ entries }: { entries: RatingEntry[] }) {
  return (
    <ul className="rating-bars">
      {entries.map((e) => (
        <li key={e.key} className="rating-bars__row">
          <span className="rating-bars__label">
            {READING_STATUS_LABEL[e.key]}
          </span>
          <span className="rating-bars__track">
            <span
              className="rating-bars__fill"
              style={{
                width: `${(e.avg / 5) * 100}%`,
                backgroundColor: READING_STATUS_COLOR[e.key],
              }}
            />
          </span>
          <span className="rating-bars__count">
            {e.avg ? e.avg.toFixed(1) : "—"}{" "}
            <small>({e.count})</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

