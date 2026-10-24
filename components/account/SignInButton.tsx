"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { SignInSheet } from "./SignInSheet";

/** Primary "Sign in" button that opens the sign-in sheet and refreshes the page afterwards. */
export function SignInButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
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
