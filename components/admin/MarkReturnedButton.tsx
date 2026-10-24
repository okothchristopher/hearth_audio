"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { markReturned } from "@/app/admin/actions";
import { Button } from "@/components/ui";

/** Closes a rental once the speaker is back. */
export function MarkReturnedButton({ rentalId, label, block = false }: { rentalId: string; label: string; block?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <span className="ha-status-toggle">
      <Button
        variant="secondary"
        block={block}
        disabled={pending}
        aria-label={label}
        onClick={() =>
          startTransition(async () => {
            setError(undefined);
            const r = await markReturned(rentalId);
            if (!r.ok) return setError(r.message);
            router.refresh();
          })
        }
      >
        {pending ? "Saving" : "Mark returned"}
      </Button>
      {error && (
        <span role="alert" className="ha-field__error">
          {error}
        </span>
      )}
    </span>
  );
}
