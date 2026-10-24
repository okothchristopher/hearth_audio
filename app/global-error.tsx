"use client"; // Error boundaries must be Client Components

import { ErrorPanel } from "@/components/shell/ErrorPanel";
import "./globals.css";

// Last resort when the root layout itself fails. Replaces the whole document, so it
// brings its own <html>, <body> and styles; fonts fall back to Georgia / system-ui.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-KE">
      <body>
        <title>Something went wrong · Hearth Audio</title>
        <main className="ha-main">
          <ErrorPanel error={error} retry={retry} />
        </main>
      </body>
    </html>
  );
}
