"use client";

import { CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button, MessagePanel } from "@/components/ui";

/** Shown by error.tsx boundaries. `retry` re-fetches and re-renders the failed segment. */
export function ErrorPanel({
  error,
  retry,
  homeHref = "/",
  homeLabel = "Browse speakers",
}: {
  error: unknown;
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  useEffect(() => {
    console.error(error); // digest matches the server log in production
  }, [error]);

  return (
    <MessagePanel
      icon={CircleAlert}
      title="Something went wrong on our side."
      actions={
        <>
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
          <Button href={homeHref} variant="ghost" size="lg">
            {homeLabel}
          </Button>
        </>
      }
    >
      Try again. If it keeps happening, come back in a few minutes.
    </MessagePanel>
  );
}
