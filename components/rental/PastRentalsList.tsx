import { StatusChip } from "@/components/ui";
import { formatDate, formatDayMonth } from "@/lib/dates";
import type { Rental } from "@/lib/rentals";

/** Renders nothing when there are no past rentals. */
export function PastRentalsList({ rentals }: { rentals: Rental[] }) {
  if (rentals.length === 0) return null;
  return (
    <section aria-labelledby="past-heading" className="ha-rental__section">
      <h2 id="past-heading" className="ha-rental__h2">
        Past rentals
      </h2>
      <ul className="ha-past">
        {rentals.map((r) => (
          <li key={r.id} className="ha-past__row">
            <div>
              <p className="ha-past__name">{r.speakerName}</p>
              <p className="ha-small ha-past__dates">
                {formatDayMonth(r.startDate)} to {formatDate(r.returnDate)}
              </p>
            </div>
            <StatusChip status={r.hasNote ? "available" : "due"}>{r.hasNote ? "Note written" : "Add a note"}</StatusChip>
          </li>
        ))}
      </ul>
    </section>
  );
}
