const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const mediaBaseUrl = apiBaseUrl.replace(/\/api\/v1$/, "");

export const mediaUrl = (relativePath: string) => `${mediaBaseUrl}/media/${relativePath}`;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    next: { revalidate: 30 },
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
