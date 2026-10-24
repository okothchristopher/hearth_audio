"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveNote } from "@/app/(renter)/actions";
import { Button, StarRating, TextField } from "@/components/ui";

const MIN_CHARS = 20;

export function NoteForm({ speakerId, speakerName }: { speakerId: string; speakerName: string }) {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const starError = touched && stars === 0 ? "Choose a star rating." : undefined;
  const textError = touched && text.trim().length < MIN_CHARS ? "Write at least 20 characters." : undefined;

  if (saved) {
    return (
      <p role="status" className="ha-rental__noted">
        Thank you. Your note is now on the {speakerName} page.
      </p>
    );
  }

  return (
    <form
      className="ha-note-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (stars === 0 || text.trim().length < MIN_CHARS) return;
        setSaveError(undefined);
        startTransition(async () => {
          const r = await saveNote(speakerId, stars, text);
          if (!r.ok) return setSaveError(r.message); // text stays in the form
          setSaved(true);
          router.refresh(); // past rentals switch to "Note written"
        });
      }}
    >
      <div className="ha-field">
        <span className="ha-field__label" id="note-stars-label">
          Your rating
        </span>
        <StarRating value={stars} onChange={setStars} size={28} />
        {starError && (
          <span className="ha-field__error" role="alert">
            {starError}
          </span>
        )}
      </div>
      <TextField
        multiline
        rows={5}
        label="Your note"
        hint="What did you play, and how did it sound in your room?"
        error={textError}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        onBlur={() => text && setTouched(true)}
      />
      <div className="ha-note-form__actions">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting" : "Submit note"}
        </Button>
        {saveError && (
          <p role="alert" className="ha-field__error">
            {saveError}
          </p>
        )}
      </div>
    </form>
  );
}
