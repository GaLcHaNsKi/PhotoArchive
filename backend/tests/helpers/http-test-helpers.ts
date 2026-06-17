import { SignJWT } from "jose";

import { env } from "@src/config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const createBearerToken = async (role: string = "admin") => {
  const token = await new SignJWT({
    userId: "user-1",
    username: "tester",
    role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return `Bearer ${token}`;
};

export const withCsrf = (headers: HeadersInit = {}, token = "csrf-test-token") => {
  const normalized = new Headers(headers);
  normalized.set("x-csrf-token", token);
  normalized.append("cookie", `pa_csrf=${token}`);
  return normalized;
};

export const json = (payload: unknown) => ({
  body: JSON.stringify(payload),
  headers: {
    "content-type": "application/json"
  }
});
