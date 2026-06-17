import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function getAuth() {
  const cookieStore = await cookies();
  return {
    sessionToken: cookieStore.get("pa_session")?.value,
    csrfToken: cookieStore.get("pa_csrf")?.value
  };
}

export async function GET() {
  const { sessionToken } = await getAuth();

  if (!sessionToken) {
    return NextResponse.json({ error: "Admin session not found" }, { status: 401 });
  }

  const response = await fetch(`${apiBaseUrl}/articles/admin`, {
    headers: { cookie: `pa_session=${sessionToken}` },
    cache: "no-store"
  });

  const data = (await response.json().catch(() => ({ error: "Request failed" }))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
