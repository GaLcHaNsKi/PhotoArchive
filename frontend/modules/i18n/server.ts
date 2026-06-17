import "server-only";

import { cookies } from "next/headers";

import { defaultLocale, getDictionary, isLocale, type Locale } from "@modules/i18n/dictionaries";

export const getLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const value = cookieStore.get("pa_lang")?.value;

  if (isLocale(value)) {
    return value;
  }

  return defaultLocale;
};

export const getI18n = async () => {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  return { locale, dictionary };
};
