import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Client acting as the signed-in user (row-level security applies to them).
 * Reads cookies, so callers render at request time and must sit inside <Suspense>.
 * Create one per request.
 */
export async function createUserClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Components can't set cookies; proxy.ts refreshes the session instead.
        }
      },
    },
  });
}

/** Anonymous client for public data (speakers, notes). Reads no cookies. */
export const publicClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** The signed-in user's id and email, verified against the auth server's keys; null when signed out. */
export async function getSignedInUser(supabase: Awaited<ReturnType<typeof createUserClient>>) {
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return claims ? { id: claims.sub, email: claims.email as string | undefined } : null;
}
