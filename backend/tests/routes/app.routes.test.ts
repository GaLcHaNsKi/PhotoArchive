import { afterEach, describe, expect, test } from "bun:test";

import { HttpError } from "@modules/common/http-error";
import { storageService } from "@modules/storage/storage.service";
import { createApp } from "@src/app";

const restoreStorageResolvePath = storageService.resolvePath;

afterEach(() => {
  storageService.resolvePath = restoreStorageResolvePath;
});

describe("app routes", () => {
  test("GET /health returns ok", async () => {
    const app = createApp();
    const response = await app.request("/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("GET /media/* returns typed storage errors", async () => {
    storageService.resolvePath = () => {
      throw new HttpError(400, "Invalid storage path");
    };

    const app = createApp();
    const response = await app.request("/media/test.jpg");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid storage path", details: null });
  });
});
