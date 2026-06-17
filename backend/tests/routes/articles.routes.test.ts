import { afterEach, describe, expect, test } from "bun:test";

import { articleService } from "@modules/articles/article.service";
import { createApp } from "@src/app";

import { createBearerToken, json, withCsrf } from "../helpers/http-test-helpers";

const restoreCreate = articleService.create;
const restoreListPublic = articleService.listPublic;
const restoreGetPublicBySlug = articleService.getPublicBySlug;

afterEach(() => {
  articleService.create = restoreCreate;
  articleService.listPublic = restoreListPublic;
  articleService.getPublicBySlug = restoreGetPublicBySlug;
});

describe("article routes", () => {
  test("GET /api/v1/articles returns public articles", async () => {
    articleService.listPublic = (async () => [
      {
        id: "article-1",
        title: "Archive story",
        slug: "archive-story",
        summary: "Editorial entry",
        tags: ["news"],
        coverPhoto: null,
        album: null
      }
    ]) as unknown as typeof articleService.listPublic;

    const app = createApp();
    const response = await app.request("/api/v1/articles?search=archive");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      items: [
        {
          id: "article-1",
          title: "Archive story",
          slug: "archive-story",
          summary: "Editorial entry",
          tags: ["news"],
          coverPhoto: null,
          album: null
        }
      ]
    });
  });

  test("GET /api/v1/articles/:slug returns article", async () => {
    articleService.getPublicBySlug = (async () => ({
      id: "article-1",
      title: "Archive story",
      slug: "archive-story",
      contentHtml: "<p>Ready</p>",
      photos: []
    })) as unknown as typeof articleService.getPublicBySlug;

    const app = createApp();
    const response = await app.request("/api/v1/articles/archive-story");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      article: {
        id: "article-1",
        title: "Archive story",
        slug: "archive-story",
        contentHtml: "<p>Ready</p>",
        photos: []
      }
    });
  });

  test("POST /api/v1/articles creates article for admin", async () => {
    articleService.create = (async () => ({ id: "article-1", title: "Archive story", slug: "archive-story" })) as unknown as typeof articleService.create;

    const app = createApp();
    const response = await app.request("/api/v1/articles", {
      method: "POST",
      ...json({
        title: "Archive story",
        slug: "archive-story",
        summary: "Editorial entry",
        contentHtml: "<p>Hello</p>",
        visibility: "public",
        tags: ["news"],
        photoIds: []
      }),
      headers: withCsrf({
        authorization: await createBearerToken("admin"),
        "content-type": "application/json"
      })
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ article: { id: "article-1", title: "Archive story", slug: "archive-story" } });
  });
});
