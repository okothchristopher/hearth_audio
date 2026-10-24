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
