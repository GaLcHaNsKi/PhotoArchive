import { PhotoStatus } from "@prisma/client";

import { HttpError } from "@modules/common/http-error";
import { prisma } from "@src/lib/prisma";

export class PhotoRepository {
  findBySha256(sha256: string) {
    return prisma.photo.findFirst({
      where: {
        sha256,
        deletedAt: null
      }
    });
  }

  async ensureAlbumExists(albumId: string) {
    const album = await prisma.album.findFirst({
      where: {
        id: albumId,
        deletedAt: null
      }
    });

    if (!album) {
      throw new HttpError(404, "Album not found");
    }
  }

  createProcessingRecord(input: {
    albumId?: string;
    title: string;
    description?: string;
    originalPath: string;
    previewPath: string;
    thumbnailPath: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: bigint;
    width: number | null;
    height: number | null;
    sha256: string;
    uploadedBy: string;
    takenAt?: Date;
  }) {
    return prisma.photo.create({
      data: {
        ...input,
        status: PhotoStatus.uploading
      }
    });
  }

  markReady(photoId: string) {
    return prisma.photo.update({
      where: { id: photoId },
      data: { status: PhotoStatus.ready },
      include: {
        album: true
      }
    });
  }

  markFailed(photoId: string) {
    return prisma.photo.update({
      where: { id: photoId },
      data: { status: PhotoStatus.failed }
    });
  }

  findPublicByAlbumSlug(slug: string) {
    return prisma.photo.findMany({
      where: {
        deletedAt: null,
        status: PhotoStatus.ready,
        album: {
          slug,
          visibility: "public",
          deletedAt: null
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  listAdminOptionsByAlbumId(albumId: string) {
    return prisma.photo.findMany({
      where: {
        albumId,
        deletedAt: null,
        status: PhotoStatus.ready
      },
      select: {
        id: true,
        title: true,
        previewPath: true,
        thumbnailPath: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
