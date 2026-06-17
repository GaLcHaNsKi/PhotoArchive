import { Visibility } from "@prisma/client";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { CreateAlbumInput, UpdateAlbumInput, AlbumQueryInput } from "@modules/albums/album.types";
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
      metadata: { title: album.title }
    });

    return album;
  }

  listPublic(query: AlbumQueryInput) {
    return this.albumRepository.listPublic(query);
  }

  async getPublicById(id: string) {
    const album = await this.albumRepository.findPublicById(id);

    if (!album) {
      throw new HttpError(404, "Album not found");
    }

    return album;
  }

  listAdminOptions() {
    return this.albumRepository.listAdminOptions();
  }

  listAdmin() {
    return this.albumRepository.listAdmin();
  }

  async update(id: string, input: UpdateAlbumInput, userId: string) {
    const album = await this.albumRepository.findById(id);

    if (!album) {
      throw new HttpError(404, "Album not found");
    }

    if (input.categoryId) {
      await this.albumRepository.ensureCategoryExists(input.categoryId);
    }

    const updated = await this.albumRepository.update(id, {
      title: input.title,
      description: input.description,
      year: input.year,
      tags: input.tags,
      categoryId: input.categoryId,
      coverPhotoId: input.coverPhotoId,
      ...(input.eventDate !== undefined ? { eventDate: new Date(input.eventDate) } : {}),
      ...(input.visibility !== undefined
        ? {
            visibility: input.visibility === "public" ? Visibility.public : Visibility.private,
            publishedAt: input.visibility === "public" && !album.publishedAt ? new Date() : album.publishedAt ?? undefined
          }
        : {})
    });

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "album.update",
      entityType: "album",
      entityId: id,
      metadata: {}
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const album = await this.albumRepository.findById(id);

    if (!album) {
      throw new HttpError(404, "Album not found");
    }

    await this.albumRepository.softDelete(id);

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "album.delete",
      entityType: "album",
      entityId: id,
      metadata: {}
    });
  }
}

export const albumService = new AlbumService();
