import { UserRole } from "@prisma/client";
import { Hono } from "hono";

import { albumController } from "@modules/albums/album.controller";
import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";

export const albumRoutes = new Hono();

albumRoutes.get("/", albumController.listPublic);
albumRoutes.get("/admin/options", requireAuth, requireRole(UserRole.root, UserRole.admin), albumController.listAdminOptions);
albumRoutes.get("/:slug", albumController.getPublicBySlug);
albumRoutes.post("/", requireAuth, requireRole(UserRole.root, UserRole.admin), albumController.create);
