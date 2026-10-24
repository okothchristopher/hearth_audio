// Suspense boundary for the speaker param, so navigation renders this shell instantly.
export default function Loading() {
  return (
    <div className="ha-speaker">
      <p role="status" className="ha-visually-hidden">
        Loading speaker
      </p>
      <div className="ha-speaker__layout" aria-hidden="true">
        <div className="ha-speaker__photo">
          <div className="ha-photo" style={{ aspectRatio: "4 / 5" }} />
        </div>
        <div className="ha-speaker__summary">
          <div className="ha-skeleton" style={{ height: 26, width: 90, borderRadius: 999 }} />
          <div className="ha-skeleton" style={{ height: 40, width: "75%" }} />
          <div className="ha-skeleton" style={{ height: 16, width: "40%" }} />
          <div className="ha-skeleton" style={{ height: 32, width: "50%" }} />
          <div className="ha-skeleton" style={{ height: 96, width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
