import { getCookie } from "hono/cookie";
import type { MiddlewareHandler } from "hono";

import { HttpError } from "@modules/common/http-error";

const protectedMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const createCsrfMiddleware = (exceptPaths: string[] = []): MiddlewareHandler => {
  return async (c, next) => {
    if (!protectedMethods.has(c.req.method) || exceptPaths.includes(c.req.path)) {
      await next();
      return;
    }

    const csrfCookie = getCookie(c, "pa_csrf");
    const csrfHeader = c.req.header("x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      throw new HttpError(403, "CSRF validation failed");
    }

    await next();
  };
};
