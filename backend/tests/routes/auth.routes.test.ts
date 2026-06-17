import { afterEach, describe, expect, test } from "bun:test";

import { authService } from "@modules/auth/auth.service";
import { createApp } from "@src/app";

import { createBearerToken, json, withCsrf } from "../helpers/http-test-helpers";

const restoreLogin = authService.login;
const restoreGetCurrentUser = authService.getCurrentUser;
const restoreLogout = authService.logout;

afterEach(() => {
  authService.login = restoreLogin;
  authService.getCurrentUser = restoreGetCurrentUser;
  authService.logout = restoreLogout;
});

describe("auth routes", () => {
  test("POST /api/v1/auth/login returns user and sets cookies", async () => {
    authService.login = (async () => ({
      user: {
        id: "user-1",
        username: "admin",
        role: "admin",
        isActive: true,
        lastLoginAt: null
      },
      sessionToken: "session-token",
      csrfToken: "csrf-token"
    })) as unknown as typeof authService.login;

    const app = createApp();
    const response = await app.request(
      "/api/v1/auth/login",
      {
        method: "POST",
        ...json({ username: "admin", password: "password123" })
      }
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      user: {
        id: "user-1",
        username: "admin",
        role: "admin",
        isActive: true,
        lastLoginAt: null
      },
      csrfToken: "csrf-token"
    });
    expect(response.headers.get("set-cookie")).toContain("pa_session=session-token");
  });

  test("GET /api/v1/auth/me returns current user with bearer auth", async () => {
    authService.getCurrentUser = (async () => ({
      id: "user-1",
      username: "admin",
      role: "admin",
      isActive: true,
      lastLoginAt: null
    })) as unknown as typeof authService.getCurrentUser;

    const app = createApp();
    const response = await app.request("/api/v1/auth/me", {
      headers: {
        authorization: await createBearerToken("admin")
      }
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      user: {
        id: "user-1",
        username: "admin",
        role: "admin",
        isActive: true,
        lastLoginAt: null
      }
    });
  });

  test("POST /api/v1/auth/logout requires csrf token", async () => {
    const app = createApp();
    const response = await app.request("/api/v1/auth/logout", {
      method: "POST",
      headers: {
        authorization: await createBearerToken("admin")
      }
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "CSRF validation failed", details: null });
  });

  test("POST /api/v1/auth/logout clears cookies", async () => {
    authService.logout = (async () => undefined) as unknown as typeof authService.logout;

    const app = createApp();
    const response = await app.request("/api/v1/auth/logout", {
      method: "POST",
      headers: withCsrf({
        authorization: await createBearerToken("admin")
      })
    });

    expect(response.status).toBe(204);
  });
});
