import { CircleCheck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Not a client component: server pages pass icon components, which can't be
// serialized into a "use client" boundary.
/** Centred empty/success panel (prototype MessagePanel). Put Buttons in `actions`. */
export function MessagePanel({
  icon,
  tone = "neutral",
  role = "status",
  title,
  children,
  actions,
}: {
  icon?: LucideIcon;
  /** "alert" for failures, so screen readers announce them at once */
  role?: "status" | "alert";
  /** "success" shows a green check unless `icon` is given */
  tone?: "neutral" | "success";
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const Icon = icon ?? (tone === "success" ? CircleCheck : undefined);
  return (
    <div role={role} className="ha-message">
      {Icon && (
        <span className={`ha-message__icon ha-message__icon--${tone}`}>
          <Icon size={40} strokeWidth={1.5} />
        </span>
      )}
      <h2 className="ha-message__title">{title}</h2>
      {children && <p className="ha-message__body">{children}</p>}
      {actions && <div className="ha-message__actions">{actions}</div>}
    </div>
  );
}
