"use client";

import { CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button, MessagePanel, RetryButton } from "@/components/ui";

/**
 * Shown by error.tsx boundaries. `retry` re-fetches and re-renders the failed segment.
 * Copy builds on claude-design-prompt.md's failed-load state ("…Check your connection
 * and try again." with a Retry button), plus a line for errors that aren't the network.
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
          <RetryButton onRetry={retry} variant="primary" size="lg" />
          <Button href={homeHref} reload={fullReload} variant="ghost" size="lg">
            {homeLabel}
          </Button>
        </>
      }
    >
      Check your connection and try again. If it still doesn&apos;t load, the problem is on our side.
    </MessagePanel>
  );
}
