import type { ComponentProps } from "react";

export function FilterTag({ selected = false, ...rest }: { selected?: boolean } & ComponentProps<"button">) {
  return <button type="button" className="ha-tag" aria-pressed={selected} {...rest} />;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: (T | { value: T; label: string })[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="ha-tabs">
      {items.map((it) => {
        const v = typeof it === "string" ? it : it.value;
        return (
          <button
            key={v}
            role="tab"
            type="button"
            className="ha-tab"
            aria-selected={v === value}
            onClick={() => onChange(v)}
          >
            {typeof it === "string" ? it : it.label}
          </button>
        );
      })}
    </div>
  );
}
