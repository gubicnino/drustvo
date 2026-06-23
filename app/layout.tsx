import type { Metadata } from "next";
import { Nunito_Sans, Lora } from "next/font/google";
import "./globals.css";
import { society } from "@/lib/society";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pd-goricko-tromeja.si";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${society.name} — pohodništvo na Goričkem in Tromeji`,
    template: `%s | ${society.name}`,
  },
  description: society.about,
  keywords: [
    "planinsko društvo",
    "pohodništvo",
    "Goričko",
    "Tromeja",
    "pohodi",
    "Prekmurje",
    "gore",
    "narava",
  ],
  openGraph: {
    type: "website",
    locale: "sl_SI",
    siteName: society.name,
    title: society.name,
    description: society.tagline,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: society.name,
    description: society.tagline,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sl" className={`${nunitoSans.variable} ${lora.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
