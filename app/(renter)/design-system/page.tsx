import { Showcase } from "./Showcase";

export const metadata = { title: "Design system" };

// Internal reference page; not linked from the main navigation.
export default function DesignSystemPage() {
  return (
    <>
      <span className="ha-label" style={{ color: "var(--text-muted)" }}>Internal</span>
      <h1 style={{ marginTop: 12 }}>Design system</h1>
      <p className="ha-lead" style={{ marginTop: 16, maxWidth: "var(--measure)" }}>
        Tokens and components ported from the Claude Design prototype.
      </p>
      <Showcase />
    </>
  );
}
