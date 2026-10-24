import { SpeakerPhoto } from "@/components/ui";
import { RENTAL_DAYS, formatDate } from "@/lib/dates";
import { daysLeft, type Rental } from "@/lib/rentals";

export function CurrentRentalCard({ rental }: { rental: Rental }) {
  const left = daysLeft(rental.returnDate);
  const elapsed = Math.min(RENTAL_DAYS, Math.max(0, RENTAL_DAYS - left));
  return (
    <section aria-labelledby="current-heading" className="ha-current">
      <div className="ha-current__photo">
        <SpeakerPhoto alt={rental.speakerName} />
      </div>
      <div className="ha-current__body">
        <h2 id="current-heading" className="ha-current__name">
          {rental.speakerName}
        </h2>
        <dl className="ha-summary">
          <div>
            <dt>Started</dt>
            <dd>{formatDate(rental.startDate)}</dd>
          </div>
          <div>
            <dt>Returns</dt>
            <dd>{formatDate(rental.returnDate)}</dd>
          </div>
          {rental.collectionDate && (
            <div>
              <dt>Collection</dt>
              <dd>{formatDate(rental.collectionDate)}</dd>
            </div>
          )}
        </dl>
        <p className="ha-current__left ha-num">{left === 1 ? "1 day left" : `${left} days left`}</p>
        <progress className="ha-progress" max={RENTAL_DAYS} value={elapsed} aria-label={`Day ${elapsed} of ${RENTAL_DAYS}`} />
      </div>
    </section>
  );
}
