// Who is using the admin area. Row-level security is what actually protects the
// data; this decides what the admin pages show. Reads cookies: use inside <Suspense>.

import { createUserClient, getSignedInUser } from "./supabase/server";

type Client = Awaited<ReturnType<typeof createUserClient>>;

export type AdminContext =
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "admin"; supabase: Client; userId: string };

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createUserClient();
  const user = await getSignedInUser(supabase);
  if (!user) return { status: "signed-out" };

  const { data, error } = await supabase.from("people").select("role").eq("id", user.id).maybeSingle();
  if (error) throw error;
  return data?.role === "admin" ? { status: "admin", supabase, userId: user.id } : { status: "forbidden" };
}

export type ActiveRental = {
  id: string;
  renter: string;
  area?: string;
  speakerName: string;
  /** "YYYY-MM-DD" delivery day */
  startDate: string;
  /** "YYYY-MM-DD": the swap collection day if booked, otherwise the return date */
  dueDate: string;
  isCollection: boolean;
};

type ActiveRentalRow = {
  id: string;
  start_date: string;
  return_date: string;
  collection_date: string | null;
  people: { name: string; area: string | null } | null;
  speakers: { name: string } | null;
};

/** Every rental not yet marked returned, soonest due first. Admins only (row-level security). */
export async function getActiveRentals(supabase: Client): Promise<ActiveRental[]> {
  const { data, error } = await supabase
    .from("rentals")
    .select("id, start_date, return_date, collection_date, people(name, area), speakers(name)")
    .is("returned_at", null);
  if (error) throw error;

  return (data as unknown as ActiveRentalRow[])
    .map((r) => ({
      id: r.id,
      renter: r.people?.name || "Renter",
      area: r.people?.area ?? undefined,
      speakerName: r.speakers?.name ?? "Speaker",
      startDate: r.start_date,
      dueDate: r.collection_date ?? r.return_date,
      isCollection: r.collection_date !== null,
    }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
