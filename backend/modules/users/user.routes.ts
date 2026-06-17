import { UserRole } from "@prisma/client";
import { Hono } from "hono";

import { requireAuth } from "@modules/common/middleware/require-auth";
import { requireRole } from "@modules/common/middleware/require-role";
import { userController } from "@modules/users/user.controller";

export const userRoutes = new Hono();

userRoutes.post("/admin", requireAuth, requireRole(UserRole.root), userController.createAdmin);
