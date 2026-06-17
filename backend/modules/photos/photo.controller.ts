import { UserRole } from "@prisma/client";

import type { AuthContext } from "@modules/common/auth-context";
import { HttpError } from "@modules/common/http-error";
import { parseOrThrow } from "@modules/common/validation";
import { photoService } from "@modules/photos/photo.service";
import { photoAdminOptionsQuerySchema, uploadPhotoFieldsSchema } from "@modules/photos/photo.types";
import { env } from "@src/config/env";

export class PhotoController {
  upload = async (c: any) => {
    const auth = c.get("auth") as AuthContext;

    if (![UserRole.root, UserRole.admin].includes(auth.role)) {
      throw new HttpError(403, "Insufficient privileges");
    }

    const form = await c.req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      throw new HttpError(400, "Image file is required");
    }

    if (file.size > env.MAX_UPLOAD_SIZE_BYTES) {
      throw new HttpError(413, "File is too large");
    }

    const fields = parseOrThrow(uploadPhotoFieldsSchema, {
      title: form.get("title"),
      description: form.get("description") || undefined,
      albumId: form.get("albumId") || undefined,
      takenAt: form.get("takenAt") || undefined
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const photo = await photoService.upload({
      ...fields,
      originalFilename: file.name,
      mimeType: file.type,
      buffer,
      uploadedBy: auth.userId
    });

    return c.json({ photo }, 201);
  };

  listPublicByAlbumSlug = async (c: any) => {
    const items = await photoService.listPublicByAlbumSlug(c.req.param("slug"));
    return c.json({ items });
  };

  listAdminOptions = async (c: any) => {
    const query = parseOrThrow(photoAdminOptionsQuerySchema, c.req.query());
    const items = await photoService.listAdminOptionsByAlbumId(query.albumId);
    return c.json({ items });
  };
}

export const photoController = new PhotoController();
