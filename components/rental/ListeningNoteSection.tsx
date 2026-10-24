import Link from "next/link";
import type { Rental } from "@/lib/rentals";
import { NoteForm } from "./NoteForm";

/** The note form, or a link to the written note once one exists. */
export function ListeningNoteSection({ rental }: { rental: Rental }) {
  return (
    <section aria-labelledby="note-heading" className="ha-rental__section">
      <h2 id="note-heading" className="ha-rental__h2">
        Write your listening note
      </h2>
      {rental.hasNote ? (
        <p className="ha-rental__noted">
          Your note is on the <Link href={`/speakers/${rental.speakerId}`}>{rental.speakerName} page</Link>.
        </p>
      ) : (
        <NoteForm speakerId={rental.speakerId} speakerName={rental.speakerName} />
      )}
    </section>
  );
}
