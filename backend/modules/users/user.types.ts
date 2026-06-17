import { z } from "zod";

export const userPublicSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["root", "admin"]),
  isActive: z.boolean(),
  lastLoginAt: z.date().nullable()
});

export const createAdminSchema = z.object({
  username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(256)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(8).max(256)
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(256)
});

export type UserPublic = z.infer<typeof userPublicSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
