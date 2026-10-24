"use client";

import { Check, CircleAlert, Info, X, type LucideIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { IconButton } from "./Button";

export type Status = "available" | "due" | "overdue" | "rented";

const STATUS_COLOR: Record<Status, string> = {
  available: "var(--status-available)",
  due: "var(--status-due)",
  overdue: "var(--status-overdue)",
  rented: "var(--text-muted)",
};

const STATUS_LABEL: Record<Status, string> = {
  available: "Available",
  due: "Returns Friday",
  overdue: "Overdue",
  rented: "Rented",
};

/** Status is always text plus colour, never colour alone. Pass the real weekday as children for `due`. */
export function StatusChip({ status = "available", children }: { status?: Status; children?: ReactNode }) {
  return (
    <span className="ha-chip" style={{ color: STATUS_COLOR[status] }}>
      {children ?? STATUS_LABEL[status]}
    </span>
  );
}

const TOAST_ICON = { success: Check, error: CircleAlert, info: Info } as const;

export function Toast({
  tone = "info",
  children,
  onClose,
}: {
  tone?: keyof typeof TOAST_ICON;
  children: ReactNode;
  onClose?: () => void;
}) {
  const Icon = TOAST_ICON[tone];
  return (
    <div role="status" className="ha-toast">
      <Icon size={18} className={`ha-toast__icon--${tone}`} />
      <span className="ha-toast__text">{children}</span>
      {onClose && (
        <button type="button" aria-label="Dismiss" className="ha-toast__close" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/** Centred empty/success panel (prototype MessagePanel). Put Buttons in `actions`. */
export function MessagePanel({
  icon: Icon,
  title,
  children,
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div role="status" className="ha-message">
      {Icon && (
        <span className="ha-message__icon">
          <Icon size={40} strokeWidth={1.5} />
        </span>
      )}
      <h2 className="ha-message__title">{title}</h2>
      {children && <p className="ha-message__body">{children}</p>}
      {actions && <div className="ha-message__actions">{actions}</div>}
    </div>
  );
}

/** Inline load/save failure (prototype ErrorBanner). */
export function ErrorBanner({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div role="alert" className="ha-error-banner">
      <span className="ha-error-banner__icon">
        <CircleAlert size={20} />
      </span>
      <div className="ha-error-banner__text">
        <p className="ha-error-banner__title">{title}</p>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function Tooltip({ content, open = false, children }: { content: ReactNode; open?: boolean; children: ReactNode }) {
  return (
    <span className={`ha-tooltip${open ? " ha-tooltip--open" : ""}`}>
      {children}
      <span role="tooltip" className="ha-tooltip__bubble">
        {content}
      </span>
    </span>
  );
}

export function Dialog({
  open = true,
  title,
  children,
  actions,
  onClose,
  width = 480,
}: {
  open?: boolean;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  width?: number;
}) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ha-dialog-scrim" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="ha-dialog" style={{ maxWidth: width }}>
        {onClose && (
          <div className="ha-dialog__close">
            <IconButton icon={X} label="Close" size="sm" onClick={onClose} />
          </div>
        )}
        {title && <h3 className="ha-dialog__title">{title}</h3>}
        <div className="ha-dialog__body">{children}</div>
        {actions && <div className="ha-dialog__actions">{actions}</div>}
      </div>
    </div>
  );
}
