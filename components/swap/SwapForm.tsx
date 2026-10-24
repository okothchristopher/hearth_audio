"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { requestSwap } from "@/app/(renter)/actions";
import { Button, DayPicker, ErrorBanner, ListeningNote, StarRating, TextField } from "@/components/ui";
import { formatDay } from "@/lib/dates";
import type { Rental } from "@/lib/rentals";

const MIN_CHARS = 20;

/**
 * Swap: listening note (skipped when one exists) + collection day + Confirm swap.
 * On success the server re-renders /swap into its "collection booked" state.
 */
export function SwapForm({ rental, from, count }: { rental: Rental; from: string; count: number }) {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [date, setDate] = useState<string>();
  const [errors, setErrors] = useState<{ stars?: string; text?: string; date?: string }>({});
  const [failure, setFailure] = useState<string>();
  const [noteSaved, setNoteSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const starsRef = useRef<HTMLDivElement>(null);

  const needNote = !rental.note && !noteSaved;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    const next: typeof errors = {};
    if (needNote && !stars) next.stars = "Choose a star rating.";
    if (needNote && t.length < MIN_CHARS) next.text = "Write at least 20 characters.";
    if (!date) next.date = "Choose a collection day.";
    setErrors(next);
    if (Object.keys(next).length) {
      // Move focus to the first problem
      const target = next.stars
        ? starsRef.current?.querySelector("button")
        : next.text
          ? document.getElementById("swap-note")
          : document.querySelector<HTMLButtonElement>(".ha-daypicker__day");
      target?.focus();
      return;
    }

    setFailure(undefined);
    startTransition(async () => {
      const r = await requestSwap({
        rentalId: rental.id,
        speakerId: rental.speakerId,
        collectionDate: date!,
        note: needNote ? { stars, text: t } : undefined,
      });
      if (r.ok) return router.refresh();
      if (r.noteSaved) setNoteSaved(true); // a retry only books the collection
      setFailure(r.message);
    });
  }

  return (
    <form className="ha-swap-form" noValidate aria-busy={pending} onSubmit={submit}>
      {failure && <ErrorBanner title="The swap was not booked.">{failure}</ErrorBanner>}

      <section aria-labelledby="swap-note-heading" className="ha-swap-form__section">
        <h2 id="swap-note-heading" className="ha-rental__h2">
          1. Your listening note
        </h2>
        {rental.note ? (
          <ListeningNote author={rental.note.author} area={rental.note.area} date={formatDay(rental.note.date)} stars={rental.note.stars}>
            {rental.note.text}
          </ListeningNote>
        ) : noteSaved ? (
          <p className="ha-rental__noted">Your note is saved.</p>
        ) : (
          <>
            <fieldset className="ha-field ha-swap-form__stars">
              <legend className="ha-field__label">Your rating for the {rental.speakerName}</legend>
              <div ref={starsRef}>
                <StarRating value={stars} onChange={(n) => (setStars(n), setErrors((e) => ({ ...e, stars: undefined })))} size={32} />
              </div>
              {errors.stars && <p className="ha-field__error">{errors.stars}</p>}
            </fieldset>
            <TextField
              id="swap-note"
              label="What did you hear?"
              multiline
              rows={5}
              value={text}
              onChange={(e) => {
                setText(e.currentTarget.value);
                setErrors((x) => ({ ...x, text: undefined }));
              }}
              hint="What did you play, and how did it sound in your room?"
              error={errors.text}
            />
          </>
        )}
      </section>

      <section aria-labelledby="swap-day-heading" className="ha-swap-form__section">
        <h2 id="swap-day-heading" className="ha-rental__h2">
          2. Collection day
        </h2>
        <DayPicker
          label="Collection and delivery day"
          hint="We collect your speaker and bring the next one on this day."
          from={from}
          count={count}
          value={date}
          onChange={(d) => {
            setDate(d);
            setErrors((x) => ({ ...x, date: undefined }));
          }}
          error={errors.date}
        />
      </section>

      <div>
        <Button type="submit" size="lg" disabled={pending} className="ha-swap-form__submit">
          {pending ? "Booking the collection" : "Confirm swap"}
        </Button>
      </div>
    </form>
  );
}
