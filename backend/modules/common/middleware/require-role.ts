import type { UserRole } from "@prisma/client";
import type { MiddlewareHandler } from "hono";

import type { AuthContext } from "@modules/common/auth-context";
import { HttpError } from "@modules/common/http-error";

export const requireRole = (...roles: UserRole[]): MiddlewareHandler => {
  return async (c, next) => {
    const auth = c.get("auth") as AuthContext | undefined;

    if (!auth || !roles.includes(auth.role)) {
      throw new HttpError(403, "Insufficient privileges");
    }

    await next();
  };
};
