"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Button, MessagePanel } from "@/components/ui";

/**
 * Shown by error.tsx boundaries. `retry` re-fetches and re-renders the failed segment.
 * Copy follows claude-design-prompt.md's failed-load state ("…Check your connection and
 * try again." with a Retry button).
 */
export function ErrorPanel({
  error,
  retry,
  homeHref = "/",
  homeLabel = "Browse speakers",
  fullReload = false,
}: {
  error: unknown;
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
  /** Leave with a full page load: needed when the root layout itself has failed */
  fullReload?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error); // digest matches the server log in production
  }, [error]);

  return (
    <MessagePanel
      role="alert"
      icon={CircleAlert}
      title="We couldn't load this page."
      actions={
        <>
          <Button size="lg" disabled={pending} onClick={() => startTransition(() => retry())}>
            {pending ? "Retrying" : "Retry"}
          </Button>
          {fullReload ? (
            <a href={homeHref} className="ha-btn ha-btn--ghost ha-btn--lg">
              {homeLabel}
            </a>
          ) : (
            <Button href={homeHref} variant="ghost" size="lg">
              {homeLabel}
            </Button>
          )}
        </>
      }
    >
      Check your connection and try again.
    </MessagePanel>
  );
}
