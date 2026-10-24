"use server";

import { getAdminContext } from "@/lib/admin";
import { PHOTO_BUCKET } from "@/lib/photos";

export type AdminResult = { ok: true } | { ok: false; message: string };

const DENIED: AdminResult = { ok: false, message: "Sign in with an admin account to do this." };

/** Mark a speaker available or rented by hand (bookings also set this automatically). */
export async function setSpeakerStatus(speakerId: string, status: "available" | "rented"): Promise<AdminResult> {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return DENIED;

  const { error } = await ctx.supabase.from("speakers").update({ status }).eq("id", speakerId);
  if (error) {
    console.error("setSpeakerStatus", error);
    return { ok: false, message: "The status wasn't changed. Try again." };
  }
  return { ok: true };
}

export type SpeakerInput = {
  /** Set when editing; omitted when adding */
  id?: string;
  name: string;
  /** Type and tuning for cards, e.g. "Bookshelf speaker, warm tuning" */
  type: string;
  pricePerMonth: number;
  description: string;
  details: { kind: string; tuning: string; size: string; room: string; connections: string };
  status: "available" | "rented";
  /** Object path of a photo already uploaded to the speaker-photos bucket */
  photoPath?: string;
};

export type SaveSpeakerResult =
  | { ok: true; id: string; name: string; status: SpeakerInput["status"] }
  | { ok: false; message: string; field?: "name" | "type" | "price" | "description" };

/** Field checks shared with SpeakerForm; returns the first problem. */
function validate(s: SpeakerInput): Extract<SaveSpeakerResult, { ok: false }> | null {
  if (!s.name.trim()) return { ok: false, field: "name", message: "Enter the speaker name." };
  if (!s.type.trim()) return { ok: false, field: "type", message: "Enter the type and tuning." };
  if (!Number.isInteger(s.pricePerMonth) || s.pricePerMonth < 100 || s.pricePerMonth > 9_999_999) {
    return { ok: false, field: "price", message: "Enter the price as a whole number, like 14500." };
  }
  if (s.description.trim().length < 30) {
    return { ok: false, field: "description", message: "Write at least 30 characters so renters know how it sounds." };
  }
  return null;
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-") || "speaker"
  );
}

/** Add or edit a speaker. New speakers go to the end of Browse. */
export async function saveSpeaker(input: SpeakerInput): Promise<SaveSpeakerResult> {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return DENIED as SaveSpeakerResult;
  const invalid = validate(input);
  if (invalid) return invalid;

  const { supabase } = ctx;
  const trimmed = Object.fromEntries(Object.entries(input.details).map(([k, v]) => [k, v.trim()]));
  const row = {
    name: input.name.trim(),
    type: input.type.trim(),
    price_per_month: input.pricePerMonth,
    description: input.description.trim(),
    details: Object.fromEntries(Object.entries(trimmed).filter(([, v]) => v)),
    status: input.status,
    ...(input.photoPath ? { photo_path: input.photoPath } : {}),
  };
  const failed = (error: unknown): SaveSpeakerResult => {
    console.error("saveSpeaker", error);
    return { ok: false, message: "Check your connection, then save again. Your entries are kept." };
  };

  if (input.id) {
    const { data: before } = await supabase.from("speakers").select("photo_path").eq("id", input.id).maybeSingle();
    const { error } = await supabase.from("speakers").update(row).eq("id", input.id);
    if (error) return failed(error);
    // Replaced photo: remove the old file so the bucket doesn't fill with orphans
    if (input.photoPath && before?.photo_path && before.photo_path !== input.photoPath) {
      await supabase.storage.from(PHOTO_BUCKET).remove([before.photo_path]);
    }
    return { ok: true, id: input.id, name: row.name, status: row.status };
  }

  const base = slugify(row.name);
  const [{ data: taken, error: takenError }, { data: last, error: lastError }] = await Promise.all([
    supabase.from("speakers").select("id").like("id", `${base}%`),
    supabase.from("speakers").select("position").order("position", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (takenError || lastError) return failed(takenError ?? lastError);
  const ids = new Set((taken ?? []).map((t) => t.id as string));
  let id = base;
  for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;

  const { error } = await supabase.from("speakers").insert({ id, ...row, position: (last?.position ?? 0) + 1 });
  if (error) return failed(error);
  return { ok: true, id, name: row.name, status: row.status };
}

/** The speaker is back: closes the rental, and a database trigger marks the speaker available. */
export async function markReturned(rentalId: string): Promise<AdminResult> {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return DENIED;

  const { error } = await ctx.supabase.from("rentals").update({ returned_at: new Date().toISOString() }).eq("id", rentalId);
  if (error) {
    console.error("markReturned", error);
    return { ok: false, message: "It wasn't marked returned. Try again." };
  }
  return { ok: true };
}
