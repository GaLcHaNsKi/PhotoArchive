import { UserRole } from "@prisma/client";
import { Hono } from "hono";

import { articleController } from "@modules/articles/article.controller";
import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";

export const articleRoutes = new Hono();

articleRoutes.get("/", articleController.listPublic);
articleRoutes.get("/:slug", articleController.getPublicBySlug);
articleRoutes.post("/", requireAuth, requireRole(UserRole.root, UserRole.admin), articleController.create);
