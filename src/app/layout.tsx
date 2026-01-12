import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import "./retro.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "GitHub Rater | Analyze Your Code Power Level",
  description: "Retro-futuristic GitHub profile analyzer. Discover your developer archetype, power level, and get roasted by AI.",
  keywords: ["github", "developer", "profile", "analyzer", "rating", "ai"],
  openGraph: {
    title: "GitHub Rater | Analyze Your Code Power Level",
    description: "Discover your developer archetype and power level",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart.variable} ${vt323.variable} antialiased bg-[#0a0a0f] text-white min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
