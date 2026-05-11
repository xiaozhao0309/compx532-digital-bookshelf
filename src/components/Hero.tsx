import type { HeroKpis } from "../utils/stats";

interface HeroProps {
  kpis: HeroKpis;
}

export function Hero({ kpis }: HeroProps) {
  const items = [
    { label: "Books", value: kpis.total, hint: "藏书总数" },
    { label: "Countries", value: kpis.countries, hint: "覆盖国家" },
    { label: "Year span", value: kpis.yearSpan, hint: "年代跨度" },
    { label: "Read", value: kpis.finishedRate, hint: "已读完成率" },
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
          切换下方分组维度，书架会重新排列；点击任意书脊查看详情。
        </p>
      </div>

      <ul className="hero__kpis" aria-label="关键指标">
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
