import { Hono } from "hono";

import { authController } from "@modules/auth/auth.controller";
import { requireAuth } from "@modules/common/middleware/require-auth";

export const authRoutes = new Hono();

authRoutes.post("/login", authController.login);
authRoutes.get("/me", requireAuth, authController.me);
authRoutes.post("/logout", requireAuth, authController.logout);
