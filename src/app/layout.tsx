import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tic Tac Toe — Ink & Editorial",
  description:
    "A hand-drawn game of tic-tac-toe. Two players, an unbeatable AI opponent, and a running score.",
  openGraph: {
    title: "Tic Tac Toe — Ink & Editorial",
    description:
      "A hand-drawn game of tic-tac-toe. Two players, an unbeatable AI opponent, and a running score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
