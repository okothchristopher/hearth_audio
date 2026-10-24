import type { ReactNode } from "react";

/** Stand-in for screens that aren't built yet. Delete once every route has its real page. */
export function Placeholder({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <section className="ha-placeholder">
      <span className="ha-label ha-placeholder__eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p className="ha-lead">{lead}</p>
      <p className="ha-placeholder__note ha-small">This screen is a placeholder. The full page is built next.</p>
      {children && <div className="ha-placeholder__links">{children}</div>}
    </section>
  );
}
