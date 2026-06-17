import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/)
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
