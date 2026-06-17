import sanitizeHtml from "sanitize-html";
import { Visibility } from "@prisma/client";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { ArticleQueryInput, CreateArticleInput } from "@modules/articles/article.types";
import { ArticleRepository } from "@modules/articles/article.repository";

const sanitizeContent = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "data-photo-id"],
      a: ["href", "name", "target", "rel"]
    },
    allowedSchemes: ["http", "https", "data"]
  });

export class ArticleService {
  constructor(private readonly articleRepository = new ArticleRepository()) {}

  async create(input: CreateArticleInput, userId: string) {
    if (input.albumId) {
      await this.articleRepository.ensureAlbumExists(input.albumId);
    }

    if (input.coverPhotoId) {
      await this.articleRepository.ensurePhotoExists(input.coverPhotoId);
    }

    for (const photoId of input.photoIds) {
      await this.articleRepository.ensurePhotoExists(photoId);
    }

    const article = await this.articleRepository.create({
      ...input,
      contentHtml: sanitizeContent(input.contentHtml),
      visibility: input.visibility === "public" ? Visibility.public : Visibility.private,
      createdBy: userId,
      publishedAt: input.visibility === "public" ? new Date() : undefined
    });

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "article.create",
      entityType: "article",
      entityId: article.id,
      metadata: { slug: article.slug }
    });

    return article;
  }

  listPublic(query: ArticleQueryInput) {
    return this.articleRepository.listPublic(query);
  }

  async getPublicBySlug(slug: string) {
    const article = await this.articleRepository.findPublicBySlug(slug);

    if (!article) {
      throw new HttpError(404, "Article not found");
    }

    return article;
  }
}

export const articleService = new ArticleService();
