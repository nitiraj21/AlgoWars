import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";



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
    <html lang="en" >
      <body className="antialiased">{children}</body>
    </html>
  );
}
