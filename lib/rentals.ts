// Rental data access for the signed-in renter (Supabase, row-level security limits
// rows to their own). Reads the session cookie: callers must sit inside <Suspense>.

import { todayInNairobi } from "./dates";
import { createUserClient, getSignedInUser } from "./supabase/server";

export type Rental = {
  id: string;
  speakerId: string;
  speakerName: string;
  /** "YYYY-MM-DD" */
  startDate: string;
  /** "YYYY-MM-DD" */
  returnDate: string;
  hasNote: boolean;
};

type RentalRow = {
  id: string;
  speaker_id: string;
  start_date: string;
  return_date: string;
  returned_at: string | null;
  speakers: { name: string } | null;
};

/** The renter's current rental and past rentals (newest first), or null when signed out. */
export async function getMyRentals(): Promise<{ current?: Rental; past: Rental[] } | null> {
  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return null;

  const [rentals, notes] = await Promise.all([
    supabase
      .from("rentals")
      .select("id, speaker_id, start_date, return_date, returned_at, speakers(name)")
      .eq("person_id", user.id)
      .order("start_date", { ascending: false }),
    supabase.from("listening_notes").select("speaker_id").eq("person_id", user.id),
  ]);
  if (rentals.error) throw rentals.error;
  if (notes.error) throw notes.error;

  const noted = new Set(notes.data.map((n) => n.speaker_id as string));
  const all = (rentals.data as unknown as RentalRow[]).map((r) => ({
    returned: r.returned_at !== null,
    rental: {
      id: r.id,
      speakerId: r.speaker_id,
      speakerName: r.speakers?.name ?? "Speaker",
      startDate: r.start_date,
      returnDate: r.return_date,
      hasNote: noted.has(r.speaker_id),
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
