import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("pa_session")?.value;
  const csrfToken = cookieStore.get("pa_csrf")?.value;

  if (sessionToken && csrfToken) {
    await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "x-csrf-token": csrfToken,
        cookie: `pa_session=${sessionToken}; pa_csrf=${csrfToken}`
      },
      cache: "no-store"
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("pa_session");
  response.cookies.delete("pa_csrf");
  return response;
}
