import Link from "next/link";

import { LanguageSwitcher } from "@components/language-switcher";
import type { Locale } from "@modules/i18n/dictionaries";

type Props = {
  locale: Locale;
  labels: {
    albums: string;
    articles: string;
    admin: string;
    languageLabel: string;
    languageEnglish: string;
    languageRussian: string;
  };
};

export function SiteHeader({ locale, labels }: Props) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        PhotoArchive
      </Link>
      <nav>
        <Link href="/albums">{labels.albums}</Link>
        <Link href="/articles">{labels.articles}</Link>
        <Link href="/admin">{labels.admin}</Link>
      </nav>
      <LanguageSwitcher englishLabel={labels.languageEnglish} label={labels.languageLabel} locale={locale} russianLabel={labels.languageRussian} />
    </header>
  );
}
