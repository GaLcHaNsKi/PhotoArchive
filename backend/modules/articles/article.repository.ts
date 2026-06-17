import { Visibility } from "@prisma/client";

import { HttpError } from "@modules/common/http-error";
import { prisma } from "@src/lib/prisma";

export class ArticleRepository {
  async ensureAlbumExists(albumId: string) {
    const album = await prisma.album.findFirst({ where: { id: albumId, deletedAt: null } });

    if (!album) {
      throw new HttpError(404, "Album not found");
    }
  }

  async ensurePhotoExists(photoId: string) {
    const photo = await prisma.photo.findFirst({ where: { id: photoId, deletedAt: null } });

    if (!photo) {
      throw new HttpError(404, "Photo not found");
    }
  }

  async create(input: {
    title: string;
    slug: string;
    summary?: string;
    contentHtml: string;
    coverPhotoId?: string;
    albumId?: string;
    tags: string[];
    visibility: Visibility;
    createdBy: string;
    publishedAt?: Date;
    photoIds: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const article = await tx.article.create({
        data: {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          contentHtml: input.contentHtml,
          coverPhotoId: input.coverPhotoId,
          albumId: input.albumId,
          tags: input.tags,
          visibility: input.visibility,
          createdBy: input.createdBy,
          publishedAt: input.publishedAt
        },
        include: {
          coverPhoto: true,
          album: true,
          photos: true
        }
      });

      if (input.photoIds.length > 0) {
        await tx.photo.updateMany({
          where: { id: { in: input.photoIds } },
          data: { articleId: article.id }
        });
      }

      return tx.article.findUniqueOrThrow({
        where: { id: article.id },
        include: {
          coverPhoto: true,
          album: true,
          photos: {
            where: { deletedAt: null, status: "ready" },
            orderBy: { createdAt: "asc" }
          }
        }
      });
    });
  }

  listPublic(query: { search?: string; tag?: string }) {
    return prisma.article.findMany({
      where: {
        deletedAt: null,
        visibility: Visibility.public,
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: "insensitive" } },
                { summary: { contains: query.search, mode: "insensitive" } }
              ]
            }
          : {}),
        ...(query.tag ? { tags: { has: query.tag.toLowerCase() } } : {})
      },
      include: {
        coverPhoto: true,
        album: true
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });
  }

  findPublicBySlug(slug: string) {
    return prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null,
        visibility: Visibility.public
      },
      include: {
        coverPhoto: true,
        album: true,
        photos: {
          where: { deletedAt: null, status: "ready" },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }
}
