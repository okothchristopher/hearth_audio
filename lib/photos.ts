// Speaker photos live in a public Supabase Storage bucket (supabase/migrations/0001_initial.sql).
// Safe to import from client components.

import { SUPABASE_URL } from "./supabase/env";

export const PHOTO_BUCKET = "speaker-photos";

/** Public bucket, so the URL needs no signing */
export function photoUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}
