import { afterEach, describe, expect, test } from "bun:test";

import { photoService } from "@modules/photos/photo.service";
import { createApp } from "@src/app";

import { createBearerToken, withCsrf } from "../helpers/http-test-helpers";

const restoreListPublicByAlbumId = photoService.listPublicByAlbumId;
const restoreUpload = photoService.upload;
const restoreListAdminOptionsByAlbumId = photoService.listAdminOptionsByAlbumId;

afterEach(() => {
  photoService.listPublicByAlbumId = restoreListPublicByAlbumId;
  photoService.upload = restoreUpload;
  photoService.listAdminOptionsByAlbumId = restoreListAdminOptionsByAlbumId;
});

describe("photo routes", () => {
  test("GET /api/v1/photos/album/:albumId returns photos", async () => {
    photoService.listPublicByAlbumId = (async () => [{ id: "photo-1", title: "Image" }]) as unknown as typeof photoService.listPublicByAlbumId;

    const app = createApp();
    const response = await app.request("/api/v1/photos/album/album-1");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ items: [{ id: "photo-1", title: "Image" }] });
  });

  test("POST /api/v1/photos/upload validates file presence", async () => {
    const app = createApp();
    const formData = new FormData();
    formData.set("title", "Image");

    const response = await app.request("/api/v1/photos/upload", {
      method: "POST",
      headers: withCsrf({ authorization: await createBearerToken("admin") }),
      body: formData
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Image file is required", details: null });
  });

  test("POST /api/v1/photos/upload uploads image for admin", async () => {
    photoService.upload = (async () => ({ id: "photo-1", title: "Image", originalPath: "originals/2026/06/image.jpg" })) as unknown as typeof photoService.upload;

    const app = createApp();
    const formData = new FormData();
    formData.set("title", "Image");
    formData.set("description", "Desc");
    formData.set("file", new File([new Uint8Array([1, 2, 3])], "image.jpg", { type: "image/jpeg" }));

    const response = await app.request("/api/v1/photos/upload", {
      method: "POST",
      headers: withCsrf({ authorization: await createBearerToken("admin") }),
      body: formData
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      photo: {
        id: "photo-1",
        title: "Image",
        originalPath: "originals/2026/06/image.jpg"
      }
    });
  });

  test("GET /api/v1/photos/admin/options returns photo options by album for admin", async () => {
    photoService.listAdminOptionsByAlbumId = (async () => [{ id: "photo-1", title: "Image", previewPath: "previews/x.webp", thumbnailPath: "thumbnails/x.webp", createdAt: "2026-01-01T00:00:00.000Z" }]) as unknown as typeof photoService.listAdminOptionsByAlbumId;

    const app = createApp();
    const response = await app.request("/api/v1/photos/admin/options?albumId=cm0aaaaaaaaaaaaaaaaaaaaaa", {
      headers: {
        authorization: await createBearerToken("admin")
      }
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      items: [
        {
          id: "photo-1",
          title: "Image",
          previewPath: "previews/x.webp",
          thumbnailPath: "thumbnails/x.webp",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ]
    });
  });
});
