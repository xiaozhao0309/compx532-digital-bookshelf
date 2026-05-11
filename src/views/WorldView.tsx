import { useMemo } from "react";
import type { Book } from "../types/book";
import { BookSpine } from "../components/BookSpine";
import { flagFor, regionFor, REGION_ORDER } from "../utils/countries";

interface WorldViewProps {
  books: Book[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelectBook: (book: Book) => void;
  yearRange: { min: number; max: number };
}

interface CountryGroup {
  country: string;
  books: Book[];
}

interface RegionGroup {
  region: string;
  countries: CountryGroup[];
  total: number;
}

export function WorldView({
  books,
  visibleIds,
  selectedId,
  onSelectBook,
  yearRange,
}: WorldViewProps) {
  const regions = useMemo<RegionGroup[]>(() => {
    const byCountry = new Map<string, Book[]>();
    for (const b of books) {
      const c = b.country?.trim() || "未知";
      const arr = byCountry.get(c) ?? [];
      arr.push(b);
      byCountry.set(c, arr);
    }
    const byRegion = new Map<string, CountryGroup[]>();
    for (const [country, items] of byCountry.entries()) {
      const region = regionFor(country);
      const arr = byRegion.get(region) ?? [];
      arr.push({
        country,
        books: [...items].sort(
          (a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0),
        ),
      });
      byRegion.set(region, arr);
    }
    return REGION_ORDER.filter((r) => byRegion.has(r))
      .map((region) => {
        const cs = byRegion.get(region)!;
        cs.sort((a, b) => b.books.length - a.books.length);
        return {
          region,
          countries: cs,
          total: cs.reduce((s, c) => s + c.books.length, 0),
        };
      });
  }, [books]);

  const totalCountries = regions.reduce(
    (s, r) => s + r.countries.length,
    0,
  );

  return (
    <div className="view view--world">
      <header className="view__head">
        <div>
          <h2>Reading Across the World</h2>
          <p>
            按地理大区组织你的藏书：共覆盖 <strong>{totalCountries}</strong>{" "}
            个国家。颜色与书架视图保持一致。
          </p>
        </div>
      </header>

      <div className="world">
        {regions.map((r) => (
          <section className="world__region" key={r.region}>
            <header className="world__region-head">
              <h3>{r.region}</h3>
              <span className="world__region-count">
                {r.countries.length} 国 · {r.total} 本
              </span>
            </header>
            <div className="world__country-grid">
              {r.countries.map((c) => (
                <article className="country-card" key={c.country}>
                  <header className="country-card__head">
                    <span className="country-card__flag" aria-hidden="true">
                      {flagFor(c.country)}
                    </span>
                    <div>
                      <h4 className="country-card__name">{c.country}</h4>
                      <span className="country-card__count">
                        {c.books.length} 本
                      </span>
                    </div>
                  </header>
                  <div className="country-card__shelf">
                    {c.books.map((book) => (
                      <BookSpine
                        key={book.id}
                        book={book}
                        yearRange={yearRange}
                        onSelect={onSelectBook}
                        dim={!visibleIds.has(book.id)}
                        selected={book.id === selectedId}
                        compact
                      />
                    ))}
                  </div>
                  <div className="country-card__plank" aria-hidden="true" />
                </article>
              ))}
            </div>
          </section>
        ))}
        {regions.length === 0 && (
          <p className="view__empty">没有书可显示。</p>
        )}
      </div>
    </div>
  );
}
