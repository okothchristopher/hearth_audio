import { Hanken_Grotesk, Young_Serif } from "next/font/google";

// brand-guide §2: Young Serif 400 only; Hanken Grotesk 400/500/600.
// Shared by app/layout.tsx and app/global-error.tsx (which renders without the layout).
const youngSerif = Young_Serif({ variable: "--font-young-serif", weight: "400", subsets: ["latin"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken-grotesk", weight: ["400", "500", "600"], subsets: ["latin"] });

/** Put on <html> so --font-heading / --font-body resolve */
export const fontVariables = `${youngSerif.variable} ${hanken.variable}`;
