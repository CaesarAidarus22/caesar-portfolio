import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import GlobalExperience from "./components/GlobalExperience";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Muhammad Caesar Aidarus | Software Engineer & AI Enthusiast",
  description:
    "Portfolio Muhammad Caesar Aidarus, seorang Software Engineer yang berfokus pada AI, Data Mining, Machine Learning, dan Full Stack Development.",
  keywords: [
    "Software Engineer",
    "AI",
    "Data Mining",
    "Machine Learning",
    "Portfolio",
    "Muhammad Caesar Aidarus",
  ],
  authors: [{ name: "Muhammad Caesar Aidarus" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body><GlobalExperience>{children}</GlobalExperience></body>
    </html>
  );
}
