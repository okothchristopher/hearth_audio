"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setSpeakerStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui";

/** "Mark rented" / "Mark available" for one speaker. */
export function StatusToggle({
  speakerId,
  speakerName,
  status,
  block = false,
}: {
  speakerId: string;
  speakerName: string;
  status: "available" | "rented";
  block?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const label = status === "available" ? "Mark rented" : "Mark available";

  return (
    <span className="ha-status-toggle">
      <Button
        variant="secondary"
        block={block}
        disabled={pending}
        aria-label={`${label}: ${speakerName}`}
        onClick={() =>
          startTransition(async () => {
            setError(undefined);
            const r = await setSpeakerStatus(speakerId, status === "available" ? "rented" : "available");
            if (!r.ok) return setError(r.message);
            router.refresh();
          })
        }
      >
        {pending ? "Saving" : label}
      </Button>
      {error && (
        <span role="alert" className="ha-field__error">
          {error}
        </span>
      )}
    </span>
  );
}
