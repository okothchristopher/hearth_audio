"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./Button";

/** "Retry" with a pending state. Re-fetches the page by default, or runs `onRetry` (e.g. an error boundary's retry). */
export function RetryButton({
  onRetry,
  variant = "secondary",
  size = "md",
}: {
  onRetry?: () => void;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button variant={variant} size={size} disabled={pending} onClick={() => start(() => (onRetry ?? router.refresh)())}>
      {pending ? "Retrying" : "Retry"}
    </Button>
  );
}
