import type { Metadata } from "next";
import { IBM_Plex_Sans, Cormorant_Garamond } from "next/font/google";

import { SiteHeader } from "@components/site-header";
import { getI18n } from "@modules/i18n/server";

import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"]
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "PhotoArchive",
  description: "Self-hosted photo archive for public collections and editorial materials"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, dictionary } = await getI18n();

  return (
    <html className={displayFont.variable} lang={locale}>
      <body className={bodyFont.className}>
        <div className="page-shell">
          <SiteHeader labels={dictionary.header} locale={locale} />
          {children}
        </div>
      </body>
    </html>
  );
}
