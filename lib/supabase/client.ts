"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/** Browser client; createBrowserClient returns a shared instance. */
export function browserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

/** The signed-in user: undefined while loading, null when signed out. */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const supabase = browserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return user;
}
