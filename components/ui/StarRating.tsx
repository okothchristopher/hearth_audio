"use client";

import { Star } from "lucide-react";
import { useState } from "react";

/** Read-only when `onChange` is omitted; otherwise a 1–5 star input. */
export function StarRating({
  value = 0,
  onChange,
  size = 16,
  showValue = false,
  count,
}: {
  value?: number;
  onChange?: (stars: number) => void;
  size?: number;
  showValue?: boolean;
  count?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const stars = [1, 2, 3, 4, 5].map((i) => {
    const icon = <Star size={size} strokeWidth={0} className={shown >= i - 0.25 ? "ha-stars__on" : "ha-stars__off"} />;
    return onChange ? (
      <button
        key={i}
        type="button"
        className="ha-star-btn"
        aria-label={`${i} ${i === 1 ? "star" : "stars"}`}
        aria-pressed={value === i}
        onMouseEnter={() => setHover(i)}
        onMouseLeave={() => setHover(0)}
        onClick={() => onChange(i)}
      >
        {icon}
      </button>
    ) : (
      <span key={i} style={{ display: "inline-flex" }}>
        {icon}
      </span>
    );
  });

  return (
    <span
      className={`ha-stars${onChange ? " ha-stars--input" : ""}`}
      role={onChange ? "group" : "img"}
      aria-label={onChange ? "Star rating" : `${value.toFixed(1)} out of 5`}
    >
      {stars}
      {showValue && <span className="ha-stars__value">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="ha-stars__count">({count})</span>}
    </span>
  );
}
