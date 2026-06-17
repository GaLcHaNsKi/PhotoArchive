import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { albumService } from "@modules/albums/album.service";
import { albumQuerySchema, createAlbumSchema } from "@modules/albums/album.types";

export class AlbumController {
  create = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const parsed = parseOrThrow(createAlbumSchema, await c.req.json());
    const payload = {
      ...parsed,
      tags: parsed.tags ?? []
    };
    const album = await albumService.create(payload, auth.userId);
    return c.json({ album }, 201);
  };

  listPublic = async (c: any) => {
    const query = parseOrThrow(albumQuerySchema, c.req.query());
    const albums = await albumService.listPublic(query);
    return c.json({ items: albums });
  };

  getPublicBySlug = async (c: any) => {
    const album = await albumService.getPublicBySlug(c.req.param("slug"));
    return c.json({ album });
  };

  listAdminOptions = async (c: any) => {
    const items = await albumService.listAdminOptions();
    return c.json({ items });
  };
}

export const albumController = new AlbumController();
