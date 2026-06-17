import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { articleService } from "@modules/articles/article.service";
import { articleQuerySchema, createArticleSchema, updateArticleSchema } from "@modules/articles/article.types";

export class ArticleController {
  listPublic = async (c: any) => {
    const query = parseOrThrow(articleQuerySchema, c.req.query());
    const items = await articleService.listPublic(query);
    return c.json({ items });
  };

  getPublicById = async (c: any) => {
    const article = await articleService.getPublicById(c.req.param("id"));
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

  listAdmin = async (c: any) => {
    const items = await articleService.listAdmin();
    return c.json({ items });
  };

  update = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const id = c.req.param("id") as string;
    const parsed = parseOrThrow(updateArticleSchema, await c.req.json());
    const article = await articleService.update(id, parsed, auth.userId);
    return c.json({ article });
  };

  delete = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const id = c.req.param("id") as string;
    await articleService.delete(id, auth.userId);
    return c.json({ success: true });
  };
}

export const articleController = new ArticleController();
