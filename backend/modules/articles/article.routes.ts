import { UserRole } from "@prisma/client";
import { Hono } from "hono";

import { articleController } from "@modules/articles/article.controller";
import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";

export const articleRoutes = new Hono();

articleRoutes.get("/", articleController.listPublic);
articleRoutes.get("/admin", requireAuth, requireRole(UserRole.root, UserRole.admin), articleController.listAdmin);
articleRoutes.get("/:id", articleController.getPublicById);
articleRoutes.post("/", requireAuth, requireRole(UserRole.root, UserRole.admin), articleController.create);
articleRoutes.put("/:id", requireAuth, requireRole(UserRole.root, UserRole.admin), articleController.update);
articleRoutes.delete("/:id", requireAuth, requireRole(UserRole.root, UserRole.admin), articleController.delete);
