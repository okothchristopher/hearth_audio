"use client";

import { useState } from "react";
import { Button, StarRating, TextField } from "@/components/ui";

const MIN_CHARS = 20;

export function NoteForm() {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  const starError = touched && stars === 0 ? "Choose a star rating." : undefined;
  const textError = touched && text.trim().length < MIN_CHARS ? "Write at least 20 characters." : undefined;

  return (
    <form
      className="ha-note-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
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
        {/* ponytail: validates only; saving needs Supabase (accounts + listening_notes) */}
        <Button type="submit">Submit note</Button>
        <p className="ha-small ha-note-form__soon">{"Notes can't be saved yet. Your text stays here."}</p>
      </div>
    </form>
  );
}
