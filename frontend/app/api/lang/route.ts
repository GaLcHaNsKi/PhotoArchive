import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@modules/i18n/dictionaries";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = isLocale(payload.locale) ? payload.locale : defaultLocale;

  const response = NextResponse.json({ ok: true, locale });
  const isSecure = new URL(request.url).protocol === "https:";

  response.cookies.set("pa_lang", locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: isSecure,
    path: "/",
    maxAge: 365 * 24 * 60 * 60
  });

  return response;
}
