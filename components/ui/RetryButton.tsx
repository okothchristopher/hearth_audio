"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./Button";

export function RetryButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button variant="secondary" disabled={pending} onClick={() => start(() => router.refresh())}>
      {pending ? "Retrying" : "Retry"}
    </Button>
  );
}
