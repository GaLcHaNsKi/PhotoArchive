import { Hono } from "hono";

import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";
import { photoController } from "@modules/photos/photo.controller";
import { UserRole } from "@prisma/client";

export const photoRoutes = new Hono();

photoRoutes.get("/album/:albumId", photoController.listPublicByAlbumId);
photoRoutes.get("/admin/options", requireAuth, requireRole(UserRole.root, UserRole.admin), photoController.listAdminOptions);
photoRoutes.post("/upload", requireAuth, photoController.upload);
photoRoutes.delete("/:id", requireAuth, requireRole(UserRole.root, UserRole.admin), photoController.delete);