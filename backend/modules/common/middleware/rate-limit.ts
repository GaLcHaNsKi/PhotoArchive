import type { MiddlewareHandler } from "hono";

import { HttpError } from "@modules/common/http-error";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const createRateLimitMiddleware = (limit: number, windowMs: number): MiddlewareHandler => {
  return async (c, next) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const now = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (bucket.count >= limit) {
      throw new HttpError(429, "Too many requests");
    }

    bucket.count += 1;
    await next();
  };
};
