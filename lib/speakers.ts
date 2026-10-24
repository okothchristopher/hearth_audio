// Speaker data access. Returns placeholder content until Supabase is wired up;
// keep callers on these functions. Ember Monitor's details and notes come from
// claude-design-prompt.md. All names and the other speakers' details and notes
// are invented placeholders.

import { formatDayMonth } from "./dates";

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
  /** "YYYY-MM-DD" the current renter returns it; set when rented */
  returnDate?: string;
  description: string;
  details: { kind: string; tuning: string; size: string; room: string; connections: string };
};

export type ListeningNote = {
  author: string;
  area?: string;
  stars: number;
  text: string;
  /** "YYYY-MM-DD" */
  date: string;
};

const SPEAKERS: Speaker[] = [
  {
    id: "ember-monitor", name: "Ember Monitor", type: "Bookshelf speaker, warm tuning", pricePerMonth: 18000, rating: 4.6, noteCount: 12, status: "available",
    description: "A warm, forward-sounding bookshelf speaker. Voices sit in the room, and the bass stays full without overwhelming a small space.",
    details: { kind: "Two-way bookshelf", tuning: "Warm", size: "28 cm tall", room: "Small to medium rooms", connections: "Bluetooth and line-in" },
  },
  {
    id: "slate-tower", name: "Slate Tower", type: "Floor-standing, neutral tuning", pricePerMonth: 32000, rating: 4.8, noteCount: 9, status: "available",
    description: "A three-way floor-standing speaker with deep, even bass. It needs a medium to large room and some space from the wall.",
    details: { kind: "Three-way floor-standing", tuning: "Neutral", size: "104 cm tall", room: "Medium to large rooms", connections: "Speaker wire, amplifier required" },
  },
  {
    id: "aria-studio", name: "Aria Studio", type: "Active monitor pair, bright and detailed", pricePerMonth: 24000, rating: 4.4, noteCount: 7, status: "rented", returnDate: "2026-11-03",
    description: "Powered monitors with Bluetooth and an optical input. Plug in and listen. No separate amplifier needed.",
    details: { kind: "Active monitor pair", tuning: "Bright and detailed", size: "30 cm tall", room: "Small to medium rooms", connections: "Bluetooth, optical and RCA" },
  },
  {
    id: "quill-compact", name: "Quill Compact", type: "Small-room speaker, forward midrange", pricePerMonth: 15000, rating: 4.5, noteCount: 5, status: "available",
    description: "A compact two-way speaker with a forward midrange and a quiet, controlled treble. Voices come through clearly in rooms up to 20 m².",
    details: { kind: "Two-way compact", tuning: "Forward midrange", size: "24 cm tall", room: "Small rooms", connections: "Speaker wire, amplifier required" },
  },
  {
    id: "meridian-wide", name: "Meridian Wide", type: "Wide soundstage, relaxed tuning", pricePerMonth: 28000, rating: 4.7, noteCount: 11, status: "rented", returnDate: "2026-11-09",
    description: "A warm, open midrange and a wide soundstage. A relaxed tuning for long evening sessions.",
    details: { kind: "Two-way stand-mount", tuning: "Relaxed, wide soundstage", size: "38 cm tall", room: "Medium rooms", connections: "Speaker wire, amplifier required" },
  },
  {
    id: "lumen-stand", name: "Lumen Stand", type: "Slim stand-mount, balanced tuning", pricePerMonth: 21000, noteCount: 0, status: "available",
    description: "A slim stand-mount with a balanced tuning. Detailed without leaning forward, and easy to place in a narrow room.",
    details: { kind: "Two-way stand-mount", tuning: "Balanced", size: "36 cm tall", room: "Small to medium rooms", connections: "Bluetooth and line-in" },
  },
];

// The most recent notes per speaker; noteCount on the speaker is the full total.
const NOTES: Record<string, ListeningNote[]> = {
  "ember-monitor": [
    { author: "Wanjiru", area: "Kilimani", stars: 5, date: "2026-10-12", text: "Played Sunday jazz and a lot of afrobeats. Vocals sit forward and nothing is harsh, even at night volume. In my small living room the bass was full without booming." },
    { author: "Brian", area: "Westlands", stars: 4, date: "2026-09-28", text: "Great for long evenings. Keep it about 30 cm from the wall or the low end gets heavy. I would want more sparkle on strings." },
    { author: "Amina", area: "Lavington", stars: 4, date: "2026-09-03", text: "Warm and forgiving with older recordings. Less exciting with electronic music. Easy to live with for a month." },
    { author: "Kevin", area: "Karen", stars: 5, date: "2026-08-20", text: "Played benga and film scores. Clean and relaxed, and it never tired my ears." },
  ],
  "slate-tower": [
    { author: "Aisha", stars: 5, date: "2026-09-10", text: "Deep, even bass with no boom in a large room. Orchestral recordings had real scale." },
    { author: "Peter", stars: 5, date: "2026-08-12", text: "Needs space. At 60 cm from the back wall the bass tightened up a lot." },
  ],
  "aria-studio": [
    { author: "Brian", stars: 4, date: "2026-09-30", text: "Easy setup with the TV over optical. Clear dialogue. The bass thins out above half volume." },
    { author: "Mercy", stars: 4, date: "2026-09-01", text: "Bluetooth from my phone stayed stable across the room. Good for a desk or a small bedroom." },
    { author: "Daniel", stars: 5, date: "2026-08-05", text: "No amplifier needed, which was the point for me. Warmer than I expected from powered speakers." },
  ],
  "quill-compact": [
    { author: "Otieno", stars: 4, date: "2026-09-28", text: "Needs a good amplifier to come alive. Once matched, the stage is wide and quiet." },
    { author: "Amina", stars: 5, date: "2026-09-02", text: "The most precise imaging I have heard at home. Less bass than I expected for jazz trios." },
  ],
  "meridian-wide": [
    { author: "Njeri", stars: 5, date: "2026-09-23", text: "Long evenings with vocal records were the highlight. The midrange is warm without going soft. It filled my lounge easily." },
    { author: "Kevin", stars: 5, date: "2026-08-24", text: "Smooth treble, so loud rock never felt harsh. I wanted a little more bass punch for electronic music." },
    { author: "Faith", stars: 4, date: "2026-07-25", text: "Needs a decent amplifier. With a good one it sounded calm and detailed." },
  ],
};

export async function getSpeakers(): Promise<Speaker[]> {
  return SPEAKERS;
}

export async function getSpeaker(id: string): Promise<Speaker | undefined> {
  return SPEAKERS.find((s) => s.id === id);
}

/** Newest first */
export async function getListeningNotes(speakerId: string): Promise<ListeningNote[]> {
  return [...(NOTES[speakerId] ?? [])].sort((a, b) => b.date.localeCompare(a.date));
}

/** "KES 18,000" */
export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

/** Chip text: "Available" or "Returns 3 Nov" */
export function statusLabel(s: Speaker) {
  return s.status === "rented" && s.returnDate ? `Returns ${formatDayMonth(s.returnDate)}` : "Available";
}
