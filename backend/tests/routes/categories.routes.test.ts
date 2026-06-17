import { afterEach, describe, expect, test } from "bun:test";

import { categoryService } from "@modules/categories/category.service";
import { createApp } from "@src/app";

import { createBearerToken, json, withCsrf } from "../helpers/http-test-helpers";

const restoreCreate = categoryService.create;
const restoreListAll = categoryService.listAll;

afterEach(() => {
  categoryService.create = restoreCreate;
  categoryService.listAll = restoreListAll;
});

describe("category routes", () => {
  test("GET /api/v1/categories returns categories", async () => {
    categoryService.listAll = (async () => [{ id: "cat-1", name: "History", _count: { albums: 5 } }]) as unknown as typeof categoryService.listAll;

    const app = createApp();
    const response = await app.request("/api/v1/categories");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      items: [{ id: "cat-1", name: "History", _count: { albums: 5 } }]
    });
  });

  test("POST /api/v1/categories creates category for admin", async () => {
    categoryService.create = (async () => ({ id: "cat-1", name: "History" })) as unknown as typeof categoryService.create;

    const app = createApp();
    const response = await app.request("/api/v1/categories", {
      method: "POST",
      ...json({ name: "History" }),
      headers: withCsrf({
        authorization: await createBearerToken("admin"),
        "content-type": "application/json"
      })
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ category: { id: "cat-1", name: "History" } });
  });
});
