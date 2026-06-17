import { deleteCookie, setCookie } from "hono/cookie";

import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { authService } from "@modules/auth/auth.service";
import { loginSchema } from "@modules/auth/auth.types";
import { env } from "@src/config/env";

const isSecure = env.APP_URL.startsWith("https://");
const cookieDomain = env.COOKIE_DOMAIN === "localhost" ? undefined : env.COOKIE_DOMAIN;

export class AuthController {
  login = async (c: any) => {
    const payload = parseOrThrow(loginSchema, await c.req.json());
    const result = await authService.login(payload);

    setCookie(c, "pa_session", result.sessionToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: isSecure,
      path: "/",
      domain: cookieDomain,
      maxAge: 8 * 60 * 60
    });
    setCookie(c, "pa_csrf", result.csrfToken, {
      httpOnly: false,
      sameSite: "Strict",
      secure: isSecure,
      path: "/",
      domain: cookieDomain,
      maxAge: 8 * 60 * 60
    });

    return c.json({ user: result.user, csrfToken: result.csrfToken });
  };

  me = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const user = await authService.getCurrentUser(auth.userId);
    return c.json({ user });
  };

  logout = async (c: any) => {
    const auth = c.get("auth") as AuthContext | undefined;

    deleteCookie(c, "pa_session", {
      path: "/",
      domain: cookieDomain
    });
    deleteCookie(c, "pa_csrf", {
      path: "/",
      domain: cookieDomain
    });

    await authService.logout(auth?.userId ?? null);
    return c.body(null, 204);
  };
}

export const authController = new AuthController();
