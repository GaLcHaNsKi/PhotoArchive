import { Visibility } from "@prisma/client";

import { HttpError } from "@modules/common/http-error";
import { prisma } from "@src/lib/prisma";

export class AlbumRepository {
  async create(input: {
    title: string;
    description?: string;
    year?: number;
    eventDate?: Date;
    visibility: Visibility;
    categoryId?: string;
    tags: string[];
    coverPhotoId?: string;
    createdBy: string;
    publishedAt?: Date;
  }) {
    return prisma.album.create({
      data: input,
      include: {
        category: true,
        coverPhoto: true
      }
    });
  }

  async ensureCategoryExists(categoryId: string) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!category) {
      throw new HttpError(404, "Category not found");
    }
  }

  listPublic(params: { search?: string; year?: number }) {
    return prisma.album.findMany({
      where: {
        deletedAt: null,
        visibility: Visibility.public,
        ...(params.search
          ? {
              OR: [
                { title: { contains: params.search, mode: "insensitive" } },
                { description: { contains: params.search, mode: "insensitive" } },
                { tags: { has: params.search.toLowerCase() } }
              ]
            }
          : {}),
        ...(params.year ? { year: params.year } : {})
      },
      orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
      include: {
        category: true,
        coverPhoto: true,
        _count: { select: { photos: true } }
      }
    });
  }

  findPublicById(id: string) {
    return prisma.album.findFirst({
      where: {
        id,
        visibility: Visibility.public,
        deletedAt: null
      },
      include: {
        category: true,
        coverPhoto: true,
        photos: {
          where: { deletedAt: null, status: "ready" },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  listAdminOptions() {
    return prisma.album.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        visibility: true,
        _count: { select: { photos: true } }
      },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  listAdmin() {
    return prisma.album.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        _count: { select: { photos: true } }
      },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  findById(id: string) {
    return prisma.album.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: Partial<{
    title: string;
    description: string | undefined;
    year: number | undefined;
    eventDate: Date | undefined;
    visibility: Visibility;
    categoryId: string | undefined;
    tags: string[];
    coverPhotoId: string | undefined;
    publishedAt: Date | undefined;
  }>) {
    return prisma.album.update({
      where: { id },
      data,
      include: { category: true, coverPhoto: true }
    });
  }

  softDelete(id: string) {
    return prisma.album.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
