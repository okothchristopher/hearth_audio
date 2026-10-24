"use client"; // Error boundaries must be Client Components

import { ErrorPanel } from "@/components/shell/ErrorPanel";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Last resort when the root layout itself fails. Replaces the whole document, so it
// brings its own <html>, <body>, fonts and styles, and leaves with a full page load.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-KE" className={fontVariables}>
      <body>
        <title>Something went wrong · Hearth Audio</title>
        <main className="ha-global-error">
          <ErrorPanel error={error} retry={retry} fullReload />
        </main>
      </body>
    </html>
  );
}
