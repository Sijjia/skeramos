import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Skeramos — Креативный дом",
  description: "Творческая арт-студия и бутик-отель в Бишкеке. Творчество, отдых и вдохновение в одном месте.",
  keywords: ["Skeramos", "творческая арт-студия", "бутик-отель", "Бишкек", "творчество", "керамика", "Кыргызстан"],
  openGraph: {
    title: "Skeramos — Креативный дом",
    description: "Творческая арт-студия и бутик-отель в сердце Кыргызстана",
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
        className={`${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
