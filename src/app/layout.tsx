import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skeramos — Креативный дом",
  description: "Гончарная мастерская и мини-отель в Бишкеке. Творчество, отдых и вдохновение в одном месте.",
  keywords: ["Skeramos", "гончарная мастерская", "мини-отель", "Бишкек", "творчество", "керамика"],
  openGraph: {
    title: "Skeramos — Креативный дом",
    description: "Гончарная мастерская и мини-отель в Бишкеке",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-zone="creativity" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
