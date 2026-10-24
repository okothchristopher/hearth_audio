// Rental data access for the signed-in renter. Returns the sample renter's rentals
// from claude-design-prompt.md until Supabase is wired up; swap the implementation here.

import { RENTAL_DAYS, addDays, todayInNairobi } from "./dates";

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

const CURRENT: Rental = {
  id: "r3", speakerId: "ember-monitor", speakerName: "Ember Monitor",
  startDate: "2026-10-09", returnDate: addDays("2026-10-09", RENTAL_DAYS), hasNote: false,
};

const PAST: Rental[] = [
  { id: "r2", speakerId: "slate-tower", speakerName: "Slate Tower", startDate: "2026-08-09", returnDate: "2026-09-08", hasNote: true },
  { id: "r1", speakerId: "quill-compact", speakerName: "Quill Compact", startDate: "2026-07-09", returnDate: "2026-08-08", hasNote: false },
];

export async function getCurrentRental(): Promise<Rental | undefined> {
  return CURRENT;
}

/** Most recent first */
export async function getPastRentals(): Promise<Rental[]> {
  return PAST;
}

/** Whole days from today (Nairobi) to the return date; never negative. */
export function daysLeft(returnDate: string) {
  const ms = Date.parse(`${returnDate}T00:00:00Z`) - Date.parse(`${todayInNairobi()}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}
