// Speaker data access (Supabase). Public reads only: no session needed.
// Schema: supabase/migrations/0001_initial.sql.

import type { Status } from "@/components/ui";
import { formatDayMonth, toNairobiDate } from "./dates";
import { publicClient } from "./supabase/server";

export type Speaker = {
  id: string;
  name: string;
  /** Type and tuning in a few words, for cards */
  type: string;
  pricePerMonth: number;
  /** Average stars across all listening notes; undefined when there are none */
  rating?: number;
  noteCount: number;
  status: "available" | "rented";
  /** "YYYY-MM-DD" the current rental ends; set when there is an active rental */
  returnDate?: string;
  description: string;
  details: { kind?: string; tuning?: string; size?: string; room?: string; connections?: string };
};

export type ListeningNote = {
  id: string;
  author: string;
  area?: string;
  stars: number;
  text: string;
  /** "YYYY-MM-DD" in Nairobi */
  date: string;
};

type SpeakerRow = {
  id: string;
  name: string;
  type: string;
  price_per_month: number;
  description: string;
  details: Speaker["details"];
  status: Speaker["status"];
};

const SPEAKER_COLUMNS = "id, name, type, price_per_month, description, details, status";

function toSpeaker(
  row: SpeakerRow,
  rating?: { rating: number; note_count: number },
  ret?: { return_date: string },
): Speaker {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    pricePerMonth: row.price_per_month,
    description: row.description,
    details: row.details ?? {},
    status: row.status,
    rating: rating ? Number(rating.rating) : undefined,
    noteCount: rating?.note_count ?? 0,
    returnDate: ret?.return_date,
  };
}

/** All speakers in Browse order. Throws when Supabase can't be reached. */
export async function getSpeakers(): Promise<Speaker[]> {
  const [speakers, ratings, returns] = await Promise.all([
    publicClient.from("speakers").select(SPEAKER_COLUMNS).order("position").order("name"),
    publicClient.from("speaker_ratings").select("speaker_id, rating, note_count"),
    publicClient.from("speaker_returns").select("speaker_id, return_date"),
  ]);
  if (speakers.error) throw speakers.error;
  if (ratings.error) throw ratings.error;
  if (returns.error) throw returns.error;

  const ratingBy = new Map(ratings.data.map((r) => [r.speaker_id, r]));
  const returnBy = new Map(returns.data.map((r) => [r.speaker_id, r]));
  return (speakers.data as SpeakerRow[]).map((s) => toSpeaker(s, ratingBy.get(s.id), returnBy.get(s.id)));
}

export async function getSpeaker(id: string): Promise<Speaker | undefined> {
  const [speaker, rating, ret] = await Promise.all([
    publicClient.from("speakers").select(SPEAKER_COLUMNS).eq("id", id).maybeSingle(),
    publicClient.from("speaker_ratings").select("rating, note_count").eq("speaker_id", id).maybeSingle(),
    publicClient.from("speaker_returns").select("return_date").eq("speaker_id", id).maybeSingle(),
  ]);
  if (speaker.error) throw speaker.error;
  if (rating.error) throw rating.error;
  if (ret.error) throw ret.error;
  return speaker.data ? toSpeaker(speaker.data as SpeakerRow, rating.data ?? undefined, ret.data ?? undefined) : undefined;
}

/** Newest first. */
export async function getListeningNotes(speakerId: string, limit = 20): Promise<ListeningNote[]> {
  const { data, error } = await publicClient
    .from("listening_notes")
    .select("id, author_name, author_area, stars, text, created_at")
    .eq("speaker_id", speakerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map((n) => ({
    id: n.id,
    author: n.author_name || "A renter",
    area: n.author_area ?? undefined,
    stars: n.stars,
    text: n.text,
    date: toNairobiDate(n.created_at),
  }));
}

/** "KES 18,000" */
export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

/** Chip text: "Available", "Returns 3 Nov", or "Rented" when no return date is known */
export function statusLabel(s: Speaker) {
  if (s.status === "available") return "Available";
  return s.returnDate ? `Returns ${formatDayMonth(s.returnDate)}` : "Rented";
}

/** Chip colour: return due uses the warning colour (brand-guide §7) */
export function chipStatus(s: Speaker): Status {
  if (s.status === "available") return "available";
  return s.returnDate ? "due" : "rented";
}
