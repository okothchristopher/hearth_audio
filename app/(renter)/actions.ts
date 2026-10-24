"use server";

import { RENTAL_DAYS, addDays, todayInNairobi } from "@/lib/dates";
import { createUserClient, getSignedInUser } from "@/lib/supabase/server";

type Failure<R extends string> = { ok: false; reason: R; message: string };

export type BookingResult =
  | { ok: true; startDate: string; returnDate: string }
  | Failure<"signin" | "conflict" | "invalid" | "error">;

/** Book a speaker for 30 days. Overlaps are rejected by the database (rentals_no_overlap). */
export async function bookSpeaker(speakerId: string, startDate: string): Promise<BookingResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || startDate < todayInNairobi()) {
    return { ok: false, reason: "invalid", message: "Choose today or a later date." };
  }

  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return { ok: false, reason: "signin", message: "Sign in to rent this speaker." };

  const { error } = await supabase
    .from("rentals")
    .insert({ person_id: user.id, speaker_id: speakerId, start_date: startDate });

  if (error?.code === "23P01") {
    return { ok: false, reason: "conflict", message: "Someone just booked this speaker. Choose different dates or another speaker." };
  }
  if (error) {
    console.error("bookSpeaker", error);
    return { ok: false, reason: "error", message: "We couldn't book this speaker. Try again." };
  }
  return { ok: true, startDate, returnDate: addDays(startDate, RENTAL_DAYS) };
}

export type NoteResult = { ok: true } | Failure<"signin" | "invalid" | "error">;

/** Save a listening note. The database only accepts notes on speakers the renter has rented. */
export async function saveNote(speakerId: string, stars: number, text: string): Promise<NoteResult> {
  const body = text.trim();
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { ok: false, reason: "invalid", message: "Choose a star rating." };
  }
  if (body.length < 20) return { ok: false, reason: "invalid", message: "Write at least 20 characters." };

  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return { ok: false, reason: "signin", message: "Sign in to write a note." };

  // author_name is filled from the renter's profile by a database trigger
  const { error } = await supabase
    .from("listening_notes")
    .insert({ speaker_id: speakerId, person_id: user.id, stars, text: body, author_name: "" });
  if (error) {
    console.error("saveNote", error);
    return { ok: false, reason: "error", message: "Your note wasn't saved. Your text is still here. Try again." };
  }
  return { ok: true };
}
