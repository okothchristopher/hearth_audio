"use client"; // Error boundaries must be Client Components

import { ErrorPanel } from "@/components/shell/ErrorPanel";

// Leads to the renter site, not /admin: the speakers list is the page most likely to have failed.
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorPanel error={error} retry={retry} homeHref="/" homeLabel="Go to the renter site" />;
}
