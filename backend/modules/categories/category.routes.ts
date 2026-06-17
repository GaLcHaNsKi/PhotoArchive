import { UserRole } from "@prisma/client";
import { Hono } from "hono";

import { categoryController } from "@modules/categories/category.controller";
import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";

export const categoryRoutes = new Hono();

categoryRoutes.get("/", categoryController.list);
categoryRoutes.post("/", requireAuth, requireRole(UserRole.root, UserRole.admin), categoryController.create);
