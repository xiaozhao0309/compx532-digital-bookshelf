import type { HeroKpis } from "../utils/stats";

interface HeroProps {
  kpis: HeroKpis;
}

export function Hero({ kpis }: HeroProps) {
  const items = [
    { label: "Books", value: kpis.total, hint: "in the collection" },
    { label: "Countries", value: kpis.countries, hint: "represented" },
    { label: "Year span", value: kpis.yearSpan, hint: "earliest – latest" },
    { label: "Read", value: kpis.finishedRate, hint: "completion rate" },
  ];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__intro">
        <p className="hero__eyebrow">COMPX532 · Information Visualization</p>
        <h1 className="hero__title" id="hero-title">
          Digital Bookshelf
        </h1>
        <p className="hero__purpose">
          This project visualises a personal digital bookshelf by organising
          books across <strong>country</strong>, <strong>time period</strong>,{" "}
          <strong>category</strong>, and <strong>reading status</strong>.
        </p>
        <p className="hero__hint">
          Toggle the grouping dimension below to reorganize the shelves; click
          any book spine for details.
        </p>
      </div>

      <ul className="hero__kpis" aria-label="Key metrics">
        {items.map((it) => (
          <li key={it.label} className="kpi-card">
            <span className="kpi-card__value">{it.value}</span>
            <span className="kpi-card__label">{it.label}</span>
            <span className="kpi-card__hint">{it.hint}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
