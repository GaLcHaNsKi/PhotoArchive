import { Visibility } from "@prisma/client";

import { HttpError } from "@modules/common/http-error";
import { prisma } from "@src/lib/prisma";

export class AlbumRepository {
  async create(input: {
    title: string;
    slug: string;
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

  findPublicBySlug(slug: string) {
    return prisma.album.findFirst({
      where: {
        slug,
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
        slug: true,
        visibility: true,
        _count: { select: { photos: true } }
      },
      orderBy: [{ createdAt: "desc" }]
    });
  }
}
