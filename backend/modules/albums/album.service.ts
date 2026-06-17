import { Visibility } from "@prisma/client";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { CreateAlbumInput, AlbumQueryInput } from "@modules/albums/album.types";
import { AlbumRepository } from "@modules/albums/album.repository";

export class AlbumService {
  constructor(private readonly albumRepository = new AlbumRepository()) {}

  async create(input: CreateAlbumInput, createdBy: string) {
    if (input.categoryId) {
      await this.albumRepository.ensureCategoryExists(input.categoryId);
    }

    const album = await this.albumRepository.create({
      ...input,
      eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      visibility: input.visibility === "public" ? Visibility.public : Visibility.private,
      createdBy,
      publishedAt: input.visibility === "public" ? new Date() : undefined
    });

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId: createdBy,
      action: "album.create",
      entityType: "album",
      entityId: album.id,
      metadata: { slug: album.slug }
    });

    return album;
  }

  listPublic(query: AlbumQueryInput) {
    return this.albumRepository.listPublic(query);
  }

  async getPublicBySlug(slug: string) {
    const album = await this.albumRepository.findPublicBySlug(slug);

    if (!album) {
      throw new HttpError(404, "Album not found");
    }

    return album;
  }

  listAdminOptions() {
    return this.albumRepository.listAdminOptions();
  }
}

export const albumService = new AlbumService();
