"use client"; // Error boundaries must be Client Components

import { ErrorPanel } from "@/components/shell/ErrorPanel";

export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorPanel error={error} retry={retry} homeHref="/admin" homeLabel="Back to speakers" />;
}
