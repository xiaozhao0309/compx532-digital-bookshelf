export type ViewMode = "bookshelf" | "timeline" | "statistics" | "world";

interface ViewModeOption {
  key: ViewMode;
  icon: string;
  label: string;
  hint: string;
}

const OPTIONS: ViewModeOption[] = [
  { key: "bookshelf", icon: "📚", label: "Bookshelf", hint: "按维度重组实体书架" },
  { key: "timeline", icon: "📅", label: "Timeline", hint: "横轴出版年的时间分布" },
  { key: "statistics", icon: "📊", label: "Statistics", hint: "六张图表的数据全景" },
  { key: "world", icon: "🌍", label: "World", hint: "按地区/国家组织的藏书" },
];

interface ViewModeSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeSwitcher({ value, onChange }: ViewModeSwitcherProps) {
  return (
    <nav className="view-switcher" aria-label="可视化视图切换">
      {OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            type="button"
            key={opt.key}
            className={`view-switcher__tab ${
              active ? "view-switcher__tab--active" : ""
            }`}
            onClick={() => onChange(opt.key)}
            aria-current={active}
          >
            <span className="view-switcher__icon" aria-hidden="true">
              {opt.icon}
            </span>
            <span className="view-switcher__text">
              <span className="view-switcher__label">{opt.label}</span>
              <span className="view-switcher__hint">{opt.hint}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
