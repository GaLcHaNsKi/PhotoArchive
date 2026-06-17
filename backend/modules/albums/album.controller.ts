import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { albumService } from "@modules/albums/album.service";
import { albumQuerySchema, createAlbumSchema, updateAlbumSchema } from "@modules/albums/album.types";

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

  getPublicById = async (c: any) => {
    const album = await albumService.getPublicById(c.req.param("id"));
    return c.json({ album });
  };

  listAdminOptions = async (c: any) => {
    const items = await albumService.listAdminOptions();
    return c.json({ items });
  };

  listAdmin = async (c: any) => {
    const items = await albumService.listAdmin();
    return c.json({ items });
  };

  update = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const id = c.req.param("id") as string;
    const parsed = parseOrThrow(updateAlbumSchema, await c.req.json());
    const album = await albumService.update(id, parsed, auth.userId);
    return c.json({ album });
  };

  delete = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const id = c.req.param("id") as string;
    await albumService.delete(id, auth.userId);
    return c.json({ success: true });
  };
}

export const albumController = new AlbumController();
