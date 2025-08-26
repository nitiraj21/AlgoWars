import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";

// Load fonts with CSS variable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlgoArena",
  description: "Real Time Multiplayer Coding Platform",
  icons: {
    icon: "/LogoHero.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
