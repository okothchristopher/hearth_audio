export function RentalSkeleton() {
  return (
    <>
      <p role="status" className="ha-visually-hidden">
        Loading your rental
      </p>
      <div className="ha-current" aria-hidden="true">
        <div className="ha-current__photo">
          <div className="ha-photo" style={{ aspectRatio: "4 / 5" }} />
        </div>
        <div className="ha-current__body">
          <div className="ha-skeleton" style={{ height: 32, width: "60%" }} />
          <div className="ha-skeleton" style={{ height: 72, width: "100%" }} />
          <div className="ha-skeleton" style={{ height: 24, width: "35%" }} />
          <div className="ha-skeleton" style={{ height: 8, width: "100%" }} />
        </div>
      </div>
    </>
  );
}
