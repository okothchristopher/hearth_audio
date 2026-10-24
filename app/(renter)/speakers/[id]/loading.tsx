// Suspense boundary for the speaker param, so navigation renders this shell instantly.
export default function Loading() {
  return (
    <section className="ha-placeholder" aria-busy="true" aria-label="Loading speaker">
      <span className="ha-label ha-placeholder__eyebrow">Speaker page</span>
      <div className="ha-skeleton" style={{ height: 44, width: "60%" }} />
      <div className="ha-skeleton" style={{ height: 24, width: "90%" }} />
    </section>
  );
}
