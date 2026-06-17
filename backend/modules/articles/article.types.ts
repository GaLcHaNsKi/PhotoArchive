import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/),
  summary: z.string().max(1000).optional(),
  contentHtml: z.string().min(1),
  coverPhotoId: z.string().cuid().optional(),
  albumId: z.string().cuid().optional(),
  photoIds: z.array(z.string().cuid()).max(100).default([]),
  tags: z.array(z.string().min(1).max(64)).max(20).default([]),
  visibility: z.enum(["public", "private"])
});

export const articleQuerySchema = z.object({
  search: z.string().max(100).optional(),
  tag: z.string().max(64).optional()
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type ArticleQueryInput = z.infer<typeof articleQuerySchema>;
