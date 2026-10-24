"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";

type FieldProps = { label?: string; hint?: string; error?: string };

function Field({ id, label, hint, error, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="ha-field">
      {label && (
        <label className="ha-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span id={`${id}-msg`} className="ha-field__error">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-msg`} className="ha-field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  id,
  multiline = false,
  rows = 4,
  ...rest
}: FieldProps & { multiline?: boolean; rows?: number } & ComponentProps<"input"> & ComponentProps<"textarea">) {
  const auto = useId();
  const fid = id ?? auto;
  const shared = {
    id: fid,
    className: "ha-input",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || hint ? `${fid}-msg` : undefined,
  };
  return (
    <Field id={fid} label={label} hint={hint} error={error}>
      {multiline ? (
        <textarea {...shared} rows={rows} {...(rest as ComponentProps<"textarea">)} />
      ) : (
        <input {...shared} {...(rest as ComponentProps<"input">)} />
      )}
    </Field>
  );
}

export function Select({
  label,
  hint,
  error,
  id,
  options,
  ...rest
}: FieldProps & { options: (string | { value: string; label: string })[] } & ComponentProps<"select">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error}>
      <select
        id={fid}
        className="ha-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fid}-msg` : undefined}
        {...rest}
      >
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </Field>
  );
}

type ToggleProps = { label: ReactNode } & Omit<ComponentProps<"input">, "type">;

export function Checkbox({ label, disabled, ...rest }: ToggleProps) {
  return (
    <label className={`ha-check${disabled ? " ha-check--disabled" : ""}`}>
      <input type="checkbox" disabled={disabled} {...rest} />
      {label}
    </label>
  );
}

export function Radio({ label, disabled, ...rest }: ToggleProps) {
  return (
    <label className={`ha-check${disabled ? " ha-check--disabled" : ""}`}>
      <input type="radio" disabled={disabled} {...rest} />
      {label}
    </label>
  );
}

/** Controlled when `checked` is passed; otherwise manages its own state. */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
}: {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
}) {
  const [own, setOwn] = useState(defaultChecked);
  const on = checked ?? own;
  const toggle = () => {
    if (checked === undefined) setOwn(!on);
    onChange?.(!on);
  };
  return (
    <label className="ha-switch" style={{ opacity: disabled ? 0.45 : 1 }}>
      <button type="button" role="switch" aria-checked={on} onClick={toggle} disabled={disabled} />
      {label}
    </label>
  );
}
