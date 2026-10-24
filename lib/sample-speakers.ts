// Placeholder content from claude-design-prompt.md. Invented names; replaced by Supabase data later.
import type { Status } from "@/components/ui";

export type SampleSpeaker = {
  id: string;
  name: string;
  summary: string;
  price: string;
  rating?: number;
  notes: number;
  status: Status;
  statusLabel?: string;
};

export const sampleSpeakers: SampleSpeaker[] = [
  { id: "ember-monitor", name: "Ember Monitor", summary: "Bookshelf speaker, warm tuning", price: "KES 18,000", rating: 4.6, notes: 12, status: "available" },
  { id: "slate-tower", name: "Slate Tower", summary: "Floor-standing, neutral tuning", price: "KES 32,000", rating: 4.8, notes: 9, status: "available" },
  { id: "aria-studio", name: "Aria Studio", summary: "Active monitor pair, bright and detailed", price: "KES 24,000", rating: 4.4, notes: 7, status: "due", statusLabel: "Returns 3 Nov" },
  { id: "quill-compact", name: "Quill Compact", summary: "Small-room speaker, forward midrange", price: "KES 15,000", rating: 4.5, notes: 5, status: "available" },
  { id: "meridian-wide", name: "Meridian Wide", summary: "Wide soundstage, relaxed tuning", price: "KES 28,000", rating: 4.7, notes: 11, status: "due", statusLabel: "Returns 9 Nov" },
  { id: "lumen-stand", name: "Lumen Stand", summary: "Slim stand-mount, balanced tuning", price: "KES 21,000", notes: 0, status: "available" },
];
