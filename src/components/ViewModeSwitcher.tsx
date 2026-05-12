export type ViewMode = "bookshelf" | "timeline" | "statistics" | "world";

interface ViewModeOption {
  key: ViewMode;
  icon: string;
  label: string;
  hint: string;
}

const OPTIONS: ViewModeOption[] = [
  {
    key: "bookshelf",
    icon: "📚",
    label: "Bookshelf",
    hint: "Reorganize the physical shelves",
  },
  {
    key: "timeline",
    icon: "📅",
    label: "Timeline",
    hint: "Books across publication years",
  },
  {
    key: "statistics",
    icon: "📊",
    label: "Statistics",
    hint: "Six charts of your collection",
  },
  {
    key: "world",
    icon: "🌍",
    label: "World",
    hint: "Books grouped by region & country",
  },
];

interface ViewModeSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeSwitcher({ value, onChange }: ViewModeSwitcherProps) {
  return (
    <nav className="view-switcher" aria-label="Visualization view switcher">
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
