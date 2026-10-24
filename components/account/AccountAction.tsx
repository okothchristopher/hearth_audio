"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { browserClient, useUser } from "@/lib/supabase/client";
import { SignInSheet } from "./SignInSheet";

/** Header action: "Sign in", or the renter's first name and "Sign out". */
export function AccountAction() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (user) {
    const first = String(user.user_metadata?.name ?? "").split(" ")[0];
    return (
      <>
        {first && <span className="ha-header__user">{first}</span>}
        <Button
          variant="ghost"
          iconStart={LogOut}
          onClick={async () => {
            await browserClient().auth.signOut();
            router.refresh();
          }}
        >
          Sign out
        </Button>
      </>
    );
  }

  return (
    <>
      {/* Stays visible while the session loads so the header doesn't shift */}
      <Button variant="ghost" iconStart={UserRound} disabled={user === undefined} onClick={() => setOpen(true)}>
        Sign in
      </Button>
      {open && (
        <SignInSheet
          onClose={() => setOpen(false)}
          onSignedIn={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
