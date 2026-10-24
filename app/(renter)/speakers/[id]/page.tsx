import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { RentAction } from "@/components/speaker/RentAction";
import { Button, ErrorBanner, ListeningNote, RetryButton, SpeakerPhoto, StarRating, StatusChip } from "@/components/ui";
import { formatDay, formatDayMonth } from "@/lib/dates";
import {
  chipStatus,
  formatKes,
  getListeningNotes,
  getSpeaker,
  statusLabel,
  type ListeningNote as Note,
  type Speaker,
} from "@/lib/speakers";

export async function generateMetadata({ params }: PageProps<"/speakers/[id]">) {
  const speaker = await getSpeaker((await params).id).catch(() => undefined);
  return { title: speaker?.name ?? "Speaker" };
}

function BackLink() {
  return (
    <Button href="/" variant="ghost" iconStart={ArrowLeft} className="ha-speaker__back">
      All speakers
    </Button>
  );
}

export default async function SpeakerPage({ params }: PageProps<"/speakers/[id]">) {
  const { id } = await params;

  let speaker: Speaker | undefined;
  let notes: Note[];
  try {
    [speaker, notes] = await Promise.all([getSpeaker(id), getListeningNotes(id)]);
  } catch {
    return (
      <div className="ha-speaker">
        <BackLink />
        <ErrorBanner title="We couldn't load this speaker." action={<RetryButton />}>
          Check your connection and try again.
        </ErrorBanner>
      </div>
    );
  }
  if (!speaker) notFound();

  const price = formatKes(speaker.pricePerMonth);
  const rented = speaker.status === "rented";
  const unavailableLabel = rented
    ? speaker.returnDate
      ? `Unavailable until ${formatDayMonth(speaker.returnDate)}`
      : "Unavailable"
    : undefined;
  const { details } = speaker;

  return (
    <div className="ha-speaker">
      <BackLink />
      <div className="ha-speaker__layout">
        <div className="ha-speaker__photo">
          <SpeakerPhoto alt={speaker.name} />
        </div>

        <div className="ha-speaker__summary">
          <StatusChip status={chipStatus(speaker)}>{statusLabel(speaker)}</StatusChip>
          <div className="ha-speaker__title">
            <h1>{speaker.name}</h1>
            <p className="ha-speaker__type">{speaker.type}</p>
          </div>
          {speaker.rating !== undefined && speaker.noteCount > 0 && (
            <StarRating value={speaker.rating} showValue count={speaker.noteCount} />
          )}
          <p className="ha-num">
            <span className="ha-speaker__price">{price}</span>
            <span className="ha-speaker__per"> / month</span>
          </p>
          <p className="ha-speaker__description">{speaker.description}</p>
          <div className="ha-speaker__aside-action">
            <RentAction layout="aside" speakerId={speaker.id} speakerName={speaker.name} price={price} unavailableLabel={unavailableLabel} />
          </div>
        </div>

        <section aria-labelledby="speaker-details" className="ha-speaker__details">
          <h2 id="speaker-details" className="ha-speaker__h2">
            Details
          </h2>
          <dl className="ha-summary">
            <div>
              <dt>Type</dt>
              <dd>{details.kind}</dd>
            </div>
            <div>
              <dt>Tuning</dt>
              <dd>{details.tuning}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{details.size}</dd>
            </div>
            <div>
              <dt>Best room size</dt>
              <dd>{details.room}</dd>
            </div>
            <div>
              <dt>Connections</dt>
              <dd>{details.connections}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="speaker-notes" className="ha-speaker__notes">
          <h2 id="speaker-notes" className="ha-speaker__h2">
            {speaker.noteCount > 0 ? `Listening notes (${speaker.noteCount})` : "Listening notes"}
          </h2>
          {notes.length > 0 ? (
            notes.map((n) => (
              <ListeningNote key={n.id} author={n.author} area={n.area} date={formatDay(n.date)} stars={n.stars}>
                {n.text}
              </ListeningNote>
            ))
          ) : (
            <p className="ha-speaker__no-notes">No listening notes yet. Be the first to rent this speaker and write one.</p>
          )}
        </section>
      </div>

      <div className="ha-speaker__bar-action">
        <RentAction layout="bar" speakerId={speaker.id} speakerName={speaker.name} price={price} unavailableLabel={unavailableLabel} />
      </div>
    </div>
  );
}
