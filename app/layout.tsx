import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Young_Serif } from "next/font/google";
import "./globals.css";

// brand-guide §2: Young Serif 400 only; Hanken Grotesk 400/500/600
const youngSerif = Young_Serif({ variable: "--font-young-serif", weight: "400", subsets: ["latin"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken-grotesk", weight: ["400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Hearth Audio", template: "%s · Hearth Audio" },
  description: "Rent a premium speaker for a month, listen at home, then swap it for a different one.",
};

export const viewport: Viewport = { themeColor: "#FBF4E9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={`${youngSerif.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
