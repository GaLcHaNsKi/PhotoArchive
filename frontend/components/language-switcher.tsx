"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { Locale } from "@modules/i18n/dictionaries";

type Props = {
  locale: Locale;
  label: string;
  englishLabel: string;
  russianLabel: string;
};

export function LanguageSwitcher({ locale, label, englishLabel, russianLabel }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="language-switcher">
      <span>{label}</span>
      <select
        defaultValue={locale as string}
        disabled={isPending}
        onChange={(event) => {
          const nextLocale = event.target.value;

          startTransition(async () => {
            await fetch("/api/lang", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ locale: nextLocale })
            });

            router.refresh();
          });
        }}
      >
        <option value="en">{englishLabel}</option>
        <option value="ru">{russianLabel}</option>
      </select>
    </label>
  );
}
