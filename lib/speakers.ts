// Speaker data access. Returns placeholder content from claude-design-prompt.md
// (invented names) until Supabase is wired up; keep callers on these functions.

export type Speaker = {
  id: string;
  name: string;
  /** Type and tuning in a few words */
  type: string;
  pricePerMonth: number;
  /** Average stars across listening notes; undefined when there are none */
  rating?: number;
  noteCount: number;
  status: "available" | "rented";
  /** ISO date the current renter returns it; set when rented */
  returnDate?: string;
};

const SPEAKERS: Speaker[] = [
  { id: "ember-monitor", name: "Ember Monitor", type: "Bookshelf speaker, warm tuning", pricePerMonth: 18000, rating: 4.6, noteCount: 12, status: "available" },
  { id: "slate-tower", name: "Slate Tower", type: "Floor-standing, neutral tuning", pricePerMonth: 32000, rating: 4.8, noteCount: 9, status: "available" },
  { id: "aria-studio", name: "Aria Studio", type: "Active monitor pair, bright and detailed", pricePerMonth: 24000, rating: 4.4, noteCount: 7, status: "rented", returnDate: "2026-11-03" },
  { id: "quill-compact", name: "Quill Compact", type: "Small-room speaker, forward midrange", pricePerMonth: 15000, rating: 4.5, noteCount: 5, status: "available" },
  { id: "meridian-wide", name: "Meridian Wide", type: "Wide soundstage, relaxed tuning", pricePerMonth: 28000, rating: 4.7, noteCount: 11, status: "rented", returnDate: "2026-11-09" },
  { id: "lumen-stand", name: "Lumen Stand", type: "Slim stand-mount, balanced tuning", pricePerMonth: 21000, noteCount: 0, status: "available" },
];

export async function getSpeakers(): Promise<Speaker[]> {
  return SPEAKERS;
}

export async function getSpeaker(id: string): Promise<Speaker | undefined> {
  return SPEAKERS.find((s) => s.id === id);
}

/** "KES 18,000" */
export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Nairobi" });

/** Chip text: "Available" or "Returns 3 Nov" */
export function statusLabel(s: Speaker) {
  return s.status === "rented" && s.returnDate ? `Returns ${dayMonth.format(new Date(s.returnDate))}` : "Available";
}
