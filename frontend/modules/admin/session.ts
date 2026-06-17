import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type AdminUser = {
  id: string;
  username: string;
  role: "root" | "admin";
  isActive: boolean;
  lastLoginAt: string | null;
};

const buildCookieHeader = (sessionToken: string) => `pa_session=${sessionToken}`;

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("pa_session")?.value;

  if (!sessionToken) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: {
      cookie: buildCookieHeader(sessionToken)
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: AdminUser };
  return data.user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
