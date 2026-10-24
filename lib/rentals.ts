// Rental data access for the signed-in renter (Supabase, row-level security limits
// rows to their own). Reads the session cookie: callers must sit inside <Suspense>.

import { addDays, todayInNairobi, toNairobiDate } from "./dates";
import type { ListeningNote } from "./speakers";
import { createUserClient, getSignedInUser } from "./supabase/server";

export type Rental = {
  id: string;
  speakerId: string;
  speakerName: string;
  /** "YYYY-MM-DD" */
  startDate: string;
  /** "YYYY-MM-DD" */
  returnDate: string;
  /** "YYYY-MM-DD" collection day once a swap is booked */
  collectionDate?: string;
  hasNote: boolean;
  /** The renter's own note on this speaker, newest */
  note?: ListeningNote;
};

type RentalRow = {
  id: string;
  speaker_id: string;
  start_date: string;
  return_date: string;
  collection_date: string | null;
  returned_at: string | null;
  speakers: { name: string } | null;
};

type NoteRow = {
  id: string;
  speaker_id: string;
  author_name: string;
  author_area: string | null;
  stars: number;
  text: string;
  created_at: string;
};

/** The renter's current rental and past rentals (newest first), or null when signed out. */
export async function getMyRentals(): Promise<{ current?: Rental; past: Rental[] } | null> {
  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return null;

  const [rentals, notes] = await Promise.all([
    supabase
      .from("rentals")
      .select("id, speaker_id, start_date, return_date, collection_date, returned_at, speakers(name)")
      .eq("person_id", user.id)
      .order("start_date", { ascending: false }),
    supabase
      .from("listening_notes")
      .select("id, speaker_id, author_name, author_area, stars, text, created_at")
      .eq("person_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  if (rentals.error) throw rentals.error;
  if (notes.error) throw notes.error;

  const noteBy = new Map<string, ListeningNote>();
  for (const n of notes.data as NoteRow[]) {
    if (noteBy.has(n.speaker_id)) continue; // newest first
    noteBy.set(n.speaker_id, {
      id: n.id,
      author: n.author_name,
      area: n.author_area ?? undefined,
      stars: n.stars,
      text: n.text,
      date: toNairobiDate(n.created_at),
    });
  }

  const all = (rentals.data as unknown as RentalRow[]).map((r) => ({
    returned: r.returned_at !== null,
    rental: {
      id: r.id,
      speakerId: r.speaker_id,
      speakerName: r.speakers?.name ?? "Speaker",
      startDate: r.start_date,
      returnDate: r.return_date,
      collectionDate: r.collection_date ?? undefined,
      hasNote: noteBy.has(r.speaker_id),
      note: noteBy.get(r.speaker_id),
    },
  }));

  return {
    current: all.find((r) => !r.returned)?.rental,
    past: all.filter((r) => r.returned).map((r) => r.rental),
  };
}

/** Whole days from today (Nairobi) to the return date; never negative. */
export function daysLeft(returnDate: string) {
  const ms = Date.parse(`${returnDate}T00:00:00Z`) - Date.parse(`${todayInNairobi()}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

/** Days a swap collection can be booked: tomorrow up to the return date, at most two weeks. */
export function collectionWindow(returnDate: string) {
  const from = addDays(todayInNairobi(), 1);
  const count = Math.min(14, daysLeft(returnDate)); // daysLeft counts tomorrow..returnDate
  return { from, count };
}
