import { z } from "zod";

export const uploadPhotoFieldsSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().max(5000).optional(),
  albumId: z.string().cuid().optional(),
  takenAt: z.string().datetime().optional()
});

export const photoAdminOptionsQuerySchema = z.object({
  albumId: z.string().cuid()
});

export type UploadPhotoFields = z.infer<typeof uploadPhotoFieldsSchema>;
export type PhotoAdminOptionsQuery = z.infer<typeof photoAdminOptionsQuerySchema>;
