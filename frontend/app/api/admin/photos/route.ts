import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("pa_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Admin session not found" }, { status: 401 });
  }

  const url = new URL(request.url);
  const albumId = url.searchParams.get("albumId");

  if (!albumId) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const response = await fetch(`${apiBaseUrl}/photos/admin/options?albumId=${encodeURIComponent(albumId)}`, {
    headers: {
      cookie: `pa_session=${sessionToken}`
    },
    cache: "no-store"
  });

  const data = (await response.json().catch(() => ({ error: "Request failed" }))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
