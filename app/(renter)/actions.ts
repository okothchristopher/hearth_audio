"use server";

import { RENTAL_DAYS, addDays, todayInNairobi } from "@/lib/dates";
import { createUserClient, getSignedInUser } from "@/lib/supabase/server";

type Failure<R extends string> = { ok: false; reason: R; message: string };

export type BookingResult =
  | { ok: true; startDate: string; returnDate: string }
  | Failure<"signin" | "conflict" | "swap-first" | "invalid" | "error">;

export type BookingStart =
  | { status: "signin" }
  /** Free to book from `earliest` (today, or the swap collection day) */
  | { status: "ready"; earliest: string; swapFrom?: string }
  /** Has a speaker and no swap booked yet */
  | { status: "swap-first"; current: string };

/** What the Rent button should do for the signed-in renter (one speaker at a time, migration 0003). */
export async function getBookingStart(): Promise<BookingStart> {
  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return { status: "signin" };

  const { data, error } = await supabase
    .from("rentals")
    .select("collection_date, speakers(name)")
    .eq("person_id", user.id)
    .is("returned_at", null);
  if (error) throw error;

  const today = todayInNairobi();
  const active = data as unknown as { collection_date: string | null; speakers: { name: string } | null }[];
  if (active.length === 0) return { status: "ready", earliest: today };
  // A swap in progress may already have its next speaker booked; only one more is allowed
  const pending = active.find((r) => r.collection_date === null);
  if (pending || active.length > 1) {
    return { status: "swap-first", current: (pending ?? active[0]).speakers?.name ?? "speaker" };
  }
  const collection = active[0].collection_date!;
  return { status: "ready", earliest: collection > today ? collection : today, swapFrom: active[0].speakers?.name };
}

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
  if (error?.code === "HA001") {
    return { ok: false, reason: "swap-first", message: "You already have a speaker. Swap it first, then rent this one from your collection day." };
  }
  if (error) {
    console.error("bookSpeaker", error);
    return { ok: false, reason: "error", message: "We couldn't book this speaker. Try again." };
  }
  return { ok: true, startDate, returnDate: addDays(startDate, RENTAL_DAYS) };
}

export type SwapResult =
  | { ok: true; collectionDate: string }
  | (Failure<"signin" | "invalid" | "note" | "error"> & { noteSaved: boolean });

/**
 * Swap: save the listening note (unless one exists), then book the collection day
 * through the request_swap database function. If the note saves but booking fails,
 * the note is kept and a retry skips straight to booking.
 */
export async function requestSwap(input: {
  rentalId: string;
  speakerId: string;
  collectionDate: string;
  note?: { stars: number; text: string };
}): Promise<SwapResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.collectionDate)) {
    return { ok: false, reason: "invalid", message: "Choose a collection day.", noteSaved: false };
  }

  const noteSaved = !!input.note;
  if (input.note) {
    const saved = await saveNote(input.speakerId, input.note.stars, input.note.text);
    if (!saved.ok) return { ...saved, reason: saved.reason === "error" ? "note" : saved.reason, noteSaved: false };
  }

  const supabase = await createUserClient();
  const { error } = await supabase.rpc("request_swap", {
    p_rental_id: input.rentalId,
    p_collection_date: input.collectionDate,
  });
  if (error?.code === "22023") {
    return { ok: false, reason: "invalid", message: "Choose a collection day before your return date.", noteSaved };
  }
  if (error) {
    console.error("requestSwap", error);
    return { ok: false, reason: "error", message: "Your note is kept. Try again in a moment.", noteSaved };
  }
  return { ok: true, collectionDate: input.collectionDate };
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
