import { connection } from "next/server";
import { Suspense } from "react";
import { NoteForm } from "@/components/rental/NoteForm";
import { Button, ErrorBanner, MessagePanel, RetryButton, SpeakerPhoto, StatusChip } from "@/components/ui";
import { RENTAL_DAYS, formatDate, formatDayMonth } from "@/lib/dates";
import { daysLeft, getCurrentRental, getPastRentals, type Rental } from "@/lib/rentals";
import { RentalSkeleton } from "./RentalSkeleton";

export const metadata = { title: "My rental" };

export default function MyRentalPage() {
  return (
    <div className="ha-rental">
      <h1>My rental</h1>
      <Suspense fallback={<RentalSkeleton />}>
        <RentalContent />
      </Suspense>
    </div>
  );
}

async function RentalContent() {
  await connection(); // days left depends on today's date

  let current: Rental | undefined;
  let past: Rental[];
  try {
    [current, past] = await Promise.all([getCurrentRental(), getPastRentals()]);
  } catch {
    return (
      <ErrorBanner title="We couldn't load your rental." action={<RetryButton />}>
        Check your connection and try again.
      </ErrorBanner>
    );
  }

  return (
    <>
      {current ? (
        <>
          <CurrentRental rental={current} />
          <section aria-labelledby="note-heading" className="ha-rental__section">
            <h2 id="note-heading" className="ha-rental__h2">
              Write your listening note
            </h2>
            <NoteForm />
          </section>
          <Button href="/" variant="secondary" className="ha-rental__swap">
            Swap for a different speaker
          </Button>
        </>
      ) : (
        <MessagePanel
          title="You don't have a speaker right now."
          actions={<Button href="/">Browse speakers</Button>}
        />
      )}

      {past.length > 0 && (
        <section aria-labelledby="past-heading" className="ha-rental__section">
          <h2 id="past-heading" className="ha-rental__h2">
            Past rentals
          </h2>
          <ul className="ha-past">
            {past.map((r) => (
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
      )}
    </>
  );
}

function CurrentRental({ rental }: { rental: Rental }) {
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
        </dl>
        <p className="ha-current__left ha-num">{left === 1 ? "1 day left" : `${left} days left`}</p>
        <progress
          className="ha-progress"
          max={RENTAL_DAYS}
          value={elapsed}
          aria-label={`Day ${elapsed} of ${RENTAL_DAYS}`}
        />
      </div>
    </section>
  );
}
