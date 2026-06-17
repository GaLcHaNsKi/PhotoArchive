import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(8).max(128)
});

export const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["root", "admin"]),
  isActive: z.boolean(),
  lastLoginAt: z.date().nullable()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
