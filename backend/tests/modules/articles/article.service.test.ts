import { afterEach, describe, expect, test } from "bun:test";
import { Visibility } from "@prisma/client";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { ArticleService } from "@modules/articles/article.service";

const restoreWrite = auditLogService.write;

afterEach(() => {
  auditLogService.write = restoreWrite;
});

describe("article service", () => {
  test("create sanitizes html before persisting", async () => {
    let persistedContentHtml = "";
    let persistedVisibility: Visibility | undefined;
    let publishedAt: Date | undefined;

    const repository = {
      ensureAlbumExists: async () => undefined,
      ensurePhotoExists: async () => undefined,
      create: async (input: { contentHtml: string; visibility: Visibility; publishedAt?: Date }) => {
        persistedContentHtml = input.contentHtml;
        persistedVisibility = input.visibility;
        publishedAt = input.publishedAt;

        return {
          id: "article-1"
        };
      }
    };

    auditLogService.write = (async () => undefined) as typeof auditLogService.write;

    const service = new ArticleService(repository as never);

    await service.create(
      {
        title: "Archive story",
        summary: "Summary",
        contentHtml: "<script>alert('x')</script><p>Safe</p>",
        visibility: "public",
        tags: [],
        photoIds: []
      },
      "user-1"
    );

    expect(persistedContentHtml).toBe("<p>Safe</p>");
    expect(persistedVisibility).toBe(Visibility.public);
    expect(publishedAt).toBeInstanceOf(Date);
  });
});
