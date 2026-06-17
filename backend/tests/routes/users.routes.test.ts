import { afterEach, describe, expect, test } from "bun:test";

import { userService } from "@modules/users/user.service";
import { createApp } from "@src/app";

import { createBearerToken, json, withCsrf } from "../helpers/http-test-helpers";

const restoreCreateAdmin = userService.createAdmin;

afterEach(() => {
  userService.createAdmin = restoreCreateAdmin;
});

describe("user routes", () => {
  test("POST /api/v1/users/admin creates admin for root", async () => {
    userService.createAdmin = (async () => ({
      id: "user-2",
      username: "archive-admin",
      role: "admin",
      isActive: true,
      lastLoginAt: null
    })) as unknown as typeof userService.createAdmin;

    const app = createApp();
    const response = await app.request("/api/v1/users/admin", {
      method: "POST",
      ...json({
        username: "archive-admin",
        password: "StrongPass123"
      }),
      headers: withCsrf({
        authorization: await createBearerToken("root"),
        "content-type": "application/json"
      })
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      user: {
        id: "user-2",
        username: "archive-admin",
        role: "admin",
        isActive: true,
        lastLoginAt: null
      }
    });
  });

  test("POST /api/v1/users/admin rejects non-root", async () => {
    const app = createApp();
    const response = await app.request("/api/v1/users/admin", {
      method: "POST",
      ...json({
        username: "archive-admin",
        password: "StrongPass123"
      }),
      headers: withCsrf({
        authorization: await createBearerToken("admin"),
        "content-type": "application/json"
      })
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Insufficient privileges", details: null });
  });
});
