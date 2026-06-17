import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";
import { jwtVerify } from "jose";

import { HttpError } from "@modules/common/http-error";
import type { AuthContext } from "@modules/common/auth-context";
import { env } from "@src/config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const bearer = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const token = bearer ?? getCookie(c, "pa_session");

  if (!token) {
    throw new HttpError(401, "Authentication required");
  }

  const verification = await jwtVerify(token, secret).catch(() => null);

  if (!verification) {
    throw new HttpError(401, "Invalid session token");
  }

  c.set("auth", verification.payload as AuthContext);
  await next();
};
