import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { articleService } from "@modules/articles/article.service";
import { articleQuerySchema, createArticleSchema } from "@modules/articles/article.types";

export class ArticleController {
  listPublic = async (c: any) => {
    const query = parseOrThrow(articleQuerySchema, c.req.query());
    const items = await articleService.listPublic(query);
    return c.json({ items });
  };

  getPublicBySlug = async (c: any) => {
    const article = await articleService.getPublicBySlug(c.req.param("slug"));
    return c.json({ article });
  };

  create = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const parsed = parseOrThrow(createArticleSchema, await c.req.json());
    const payload = {
      ...parsed,
      tags: parsed.tags ?? [],
      photoIds: parsed.photoIds ?? []
    };
    const article = await articleService.create(payload, auth.userId);
    return c.json({ article }, 201);
  };
}

export const articleController = new ArticleController();
