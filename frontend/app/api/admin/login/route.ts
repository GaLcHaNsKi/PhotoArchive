import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const splitSetCookieHeader = (header: string | null) => {
  if (!header) {
    return [];
  }

  return header.split(/,(?=\s*[A-Za-z0-9_-]+=)/g);
};

const extractCookieValue = (cookies: string[], name: string) => {
  const match = cookies.find((item) => item.startsWith(`${name}=`));
  return match?.slice(name.length + 1).split(";")[0];
};

export async function POST(request: Request) {
  const payload = await request.json();
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  const data = (await response.json().catch(() => ({ error: "Request failed" }))) as Record<string, unknown>;

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const cookieHeaders = typeof getSetCookie === "function" ? getSetCookie.call(response.headers) : splitSetCookieHeader(response.headers.get("set-cookie"));
  const sessionToken = extractCookieValue(cookieHeaders, "pa_session");
  const csrfToken = extractCookieValue(cookieHeaders, "pa_csrf") ?? String(data.csrfToken ?? "");

  if (!sessionToken || !csrfToken) {
    return NextResponse.json({ error: "Backend login cookies were not returned" }, { status: 502 });
  }

  const nextResponse = NextResponse.json(data, { status: response.status });
  const isSecure = new URL(request.url).protocol === "https:";

  nextResponse.cookies.set("pa_session", sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
    maxAge: 8 * 60 * 60
  });
  nextResponse.cookies.set("pa_csrf", csrfToken, {
    httpOnly: false,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
    maxAge: 8 * 60 * 60
  });

  return nextResponse;
}
