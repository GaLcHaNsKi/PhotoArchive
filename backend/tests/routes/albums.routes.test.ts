import { afterEach, describe, expect, test } from "bun:test";

import { albumService } from "@modules/albums/album.service";
import { createApp } from "@src/app";

import { createBearerToken, json, withCsrf } from "../helpers/http-test-helpers";

const restoreCreate = albumService.create;
const restoreListPublic = albumService.listPublic;
const restoreGetPublicById = albumService.getPublicById;
const restoreListAdminOptions = albumService.listAdminOptions;

afterEach(() => {
  albumService.create = restoreCreate;
  albumService.listPublic = restoreListPublic;
  albumService.getPublicById = restoreGetPublicById;
  albumService.listAdminOptions = restoreListAdminOptions;
});

describe("album routes", () => {
  test("GET /api/v1/albums returns public albums", async () => {
    albumService.listPublic = (async () => [{ id: "album-1", title: "Archive" }]) as unknown as typeof albumService.listPublic;

    const app = createApp();
    const response = await app.request("/api/v1/albums?search=arc");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ items: [{ id: "album-1", title: "Archive" }] });
  });

  test("GET /api/v1/albums/:id returns album", async () => {
    albumService.getPublicById = (async () => ({ id: "album-1", title: "Archive", photos: [] })) as unknown as typeof albumService.getPublicById;

    const app = createApp();
    const response = await app.request("/api/v1/albums/album-1");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ album: { id: "album-1", title: "Archive", photos: [] } });
  });

  test("POST /api/v1/albums creates album for admin", async () => {
    albumService.create = (async () => ({ id: "album-1", title: "Archive" })) as unknown as typeof albumService.create;

    const app = createApp();
    const response = await app.request("/api/v1/albums", {
      method: "POST",
      headers: withCsrf({
        authorization: await createBearerToken("admin"),
        "content-type": "application/json"
      }),
      body: JSON.stringify({
        title: "Archive",
        visibility: "public",
        tags: []
      })
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ album: { id: "album-1", title: "Archive" } });
  });

  test("POST /api/v1/albums rejects insufficient role", async () => {
    const app = createApp();
    const response = await app.request("/api/v1/albums", {
      method: "POST",
      ...json({
        title: "Archive",
        visibility: "public",
        tags: []
      }),
      headers: withCsrf({
        authorization: await createBearerToken("user"),
        "content-type": "application/json"
      })
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Insufficient privileges", details: null });
  });

  test("GET /api/v1/albums/admin/options returns admin list for admin role", async () => {
    albumService.listAdminOptions = (async () => [{ id: "album-1", title: "Archive", visibility: "private", _count: { photos: 7 } }]) as unknown as typeof albumService.listAdminOptions;

    const app = createApp();
    const response = await app.request("/api/v1/albums/admin/options", {
      headers: {
        authorization: await createBearerToken("admin")
      }
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      items: [{ id: "album-1", title: "Archive", visibility: "private", _count: { photos: 7 } }]
    });
  });
});
