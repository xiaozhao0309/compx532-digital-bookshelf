import type { GroupKey } from "../utils/grouping";
import { GROUPING_ICONS, GROUPING_LABELS } from "../utils/grouping";

interface GroupingToggleProps {
  value: GroupKey;
  onChange: (key: GroupKey) => void;
}

const OPTIONS: GroupKey[] = ["country", "decade", "category", "status"];

export function GroupingToggle({ value, onChange }: GroupingToggleProps) {
  return (
    <div className="grouping-toggle" role="tablist" aria-label="书架分组方式">
      <span className="grouping-toggle__caption">Organise shelves by</span>
      <div className="grouping-toggle__pills">
        {OPTIONS.map((key) => {
          const active = key === value;
          return (
            <button
              type="button"
              key={key}
              role="tab"
              aria-selected={active}
              className={`grouping-toggle__pill ${
                active ? "grouping-toggle__pill--active" : ""
              }`}
              onClick={() => onChange(key)}
            >
              <span className="grouping-toggle__icon" aria-hidden="true">
                {GROUPING_ICONS[key]}
              </span>
              <span>{GROUPING_LABELS[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
