import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Hearth Audio", template: "%s · Hearth Audio" },
  description: "Rent a premium speaker for a month, listen at home, then swap it for a different one.",
};

export const viewport: Viewport = { themeColor: "#FBF4E9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
