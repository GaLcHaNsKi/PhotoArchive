import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { authRoutes } from "@modules/auth/auth.routes";
import { articleRoutes } from "@modules/articles/article.routes";
import { albumRoutes } from "@modules/albums/album.routes";
import { categoryRoutes } from "@modules/categories/category.routes";
import { createCsrfMiddleware } from "@modules/common/middleware/csrf";
import { handleAppError } from "@modules/common/middleware/error-handler";
import { createRateLimitMiddleware } from "@modules/common/middleware/rate-limit";
import { photoRoutes } from "@modules/photos/photo.routes";
import { storageService } from "@modules/storage/storage.service";
import { userRoutes } from "@modules/users/user.routes";

type Variables = {
  auth: {
    userId: string;
    username: string;
    role: "root" | "admin";
  };
};

export const createApp = () => {
  const app = new Hono<{ Variables: Variables }>();

  app.use("/api/*", createRateLimitMiddleware(120, 60_000));
  app.use("/api/v1/*", createCsrfMiddleware(["/api/v1/auth/login"]));

  app.get("/health", (c) => c.json({ ok: true }));
  app.get("/media/*", async (c) => {
    const requestedPath = c.req.path.replace(/^\/media\//, "");
    const absolutePath = storageService.resolvePath(requestedPath);
    return serveStatic({ path: absolutePath, root: "/" })(c, async () => undefined);
  });

  app.route("/api/v1/auth", authRoutes);
  app.route("/api/v1/articles", articleRoutes);
  app.route("/api/v1/albums", albumRoutes);
  app.route("/api/v1/categories", categoryRoutes);
  app.route("/api/v1/photos", photoRoutes);
  app.route("/api/v1/users", userRoutes);

  app.onError(handleAppError);
  return app;
};
