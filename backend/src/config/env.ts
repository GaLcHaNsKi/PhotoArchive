import path from "node:path";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(16),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  COOKIE_DOMAIN: z.string().min(1),
  STORAGE_ROOT: z.string().min(1),
  ORIGINALS_PATH: z.string().startsWith("/"),
  PREVIEWS_PATH: z.string().startsWith("/"),
  THUMBNAILS_PATH: z.string().startsWith("/"),
  AUDIT_LOG_ROOT: z.string().min(1),
  MAX_UPLOAD_SIZE_BYTES: z.coerce.number().int().positive().default(10 * 1024 * 1024),
  PORT: z.coerce.number().int().positive().default(4000)
});

export const env = envSchema.parse(process.env);
