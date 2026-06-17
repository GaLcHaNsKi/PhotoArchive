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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sessionToken, csrfToken } = await getAuth();

  if (!sessionToken || !csrfToken) {
    return NextResponse.json({ error: "Admin session not found" }, { status: 401 });
  }

  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "DELETE",
    headers: {
      "x-csrf-token": csrfToken,
      cookie: `pa_session=${sessionToken}; pa_csrf=${csrfToken}`
    },
    cache: "no-store"
  });

  const data = (await response.json().catch(() => ({ error: "Request failed" }))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
