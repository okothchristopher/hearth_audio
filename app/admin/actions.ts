"use server";

import { getAdminContext } from "@/lib/admin";

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
