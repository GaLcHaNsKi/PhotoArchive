import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("pa_session")?.value;
  const csrfToken = cookieStore.get("pa_csrf")?.value;

  if (!sessionToken || !csrfToken) {
    return NextResponse.json({ error: "Admin session not found" }, { status: 401 });
  }

  const body = await request.text();
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-csrf-token": csrfToken,
      cookie: `pa_session=${sessionToken}; pa_csrf=${csrfToken}`
    },
    body,
    cache: "no-store"
  });

  const data = (await response.json().catch(() => ({ error: "Request failed" }))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
