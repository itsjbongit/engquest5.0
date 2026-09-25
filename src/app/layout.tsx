import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Sans } from "next/font/google";
import { festival as f } from "@/content/festival";
import SplashCursor from "@/components/SplashCursor/SplashCursor";
import "./globals.css";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-body" });

const title = `${f.name} ${f.edition} | ${f.school} | JNU`;
const description = `${f.subtitle}, ${f.school}, ${f.university}. ${f.date}, ${f.venue}.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"), // PLACEHOLDER canonical URL
  title, description, alternates: { canonical: "/" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <SplashCursor COLOR="#6705c5" />
      </body>
    </html>
  );
}
