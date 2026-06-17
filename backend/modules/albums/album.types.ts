import { z } from "zod";

export const createAlbumSchema = z.object({
  title: z.string().min(2).max(180),
  description: z.string().max(5000).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  eventDate: z.string().datetime().optional(),
  visibility: z.enum(["public", "private"]),
  categoryId: z.string().cuid().optional(),
  tags: z.array(z.string().min(1).max(64)).max(20).default([]),
  coverPhotoId: z.string().cuid().optional()
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const albumQuerySchema = z.object({
  search: z.string().max(100).optional(),
  year: z.coerce.number().int().optional()
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type AlbumQueryInput = z.infer<typeof albumQuerySchema>;
