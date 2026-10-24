"use client";

import { useId } from "react";
import { addDays, formatDate } from "@/lib/dates";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Pick one of the next `count` days as a grid of day buttons (prototype DatePicker). */
export function DayPicker({
  label,
  hint,
  from,
  count,
  value,
  onChange,
  error,
  selectedPrefix = "Selected",
}: {
  label: string;
  hint?: string;
  /** First selectable day, "YYYY-MM-DD" */
  from: string;
  count: number;
  value?: string;
  onChange: (isoDate: string) => void;
  error?: string;
  selectedPrefix?: string;
}) {
  const id = useId();
  const days = Array.from({ length: count }, (_, i) => addDays(from, i));

  return (
    <fieldset className="ha-field ha-daypicker" aria-describedby={`${id}-summary`}>
      <legend className="ha-field__label">{label}</legend>
      {hint && <p className="ha-field__hint">{hint}</p>}
      <div className="ha-daypicker__grid">
        {days.map((iso) => {
          const d = new Date(`${iso}T00:00:00Z`);
          return (
            <button
              key={iso}
              type="button"
              className="ha-daypicker__day"
              aria-pressed={iso === value}
              aria-label={formatDate(iso)}
              data-invalid={error ? "" : undefined}
              onClick={() => onChange(iso)}
            >
              <span className="ha-daypicker__wd">{WEEKDAYS[d.getUTCDay()]}</span>
              <span className="ha-daypicker__num">{d.getUTCDate()}</span>
            </button>
          );
        })}
      </div>
      <p id={`${id}-summary`} className="ha-small ha-num">
        {value ? `${selectedPrefix}: ${formatDate(value)}` : "No day chosen yet."}
      </p>
      {error && (
        <p role="alert" className="ha-field__error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
