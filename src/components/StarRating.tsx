interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = 20,
  readOnly = false,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div
      className="star-rating"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`评分 ${value} / 5`}
    >
      {stars.map((s) => {
        const active = s <= value;
        const handleClick = () => {
          if (readOnly || !onChange) return;
          onChange(s === value ? 0 : s);
        };
        return (
          <button
            key={s}
            type="button"
            className={`star ${active ? "star--active" : ""}`}
            onClick={handleClick}
            disabled={readOnly}
            aria-label={`${s} 星`}
            style={{ fontSize: size }}
          >
            {active ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
