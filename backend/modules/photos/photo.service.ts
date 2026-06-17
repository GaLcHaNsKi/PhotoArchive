import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { UploadPhotoFields } from "@modules/photos/photo.types";
import { PhotoRepository } from "@modules/photos/photo.repository";
import { storageService } from "@modules/storage/storage.service";

type UploadPhotoInput = UploadPhotoFields & {
  originalFilename: string;
  mimeType: string;
  buffer: Buffer;
  uploadedBy: string;
};

export class PhotoService {
  constructor(private readonly photoRepository = new PhotoRepository()) {}

  async upload(input: UploadPhotoInput) {
    if (input.albumId) {
      await this.photoRepository.ensureAlbumExists(input.albumId);
    }

    const stored = await storageService.persistImage(input.buffer, input.mimeType);
    const existing = await this.photoRepository.findBySha256(stored.sha256);

    if (existing) {
      throw new HttpError(409, "Photo with the same content already exists");
    }

    const photo = await this.photoRepository.createProcessingRecord({
      albumId: input.albumId,
      title: input.title,
      description: input.description,
      originalPath: stored.originalPath,
      previewPath: stored.previewPath,
      thumbnailPath: stored.thumbnailPath,
      originalFilename: input.originalFilename,
      mimeType: input.mimeType,
      sizeBytes: BigInt(stored.sizeBytes),
      width: stored.width,
      height: stored.height,
      sha256: stored.sha256,
      uploadedBy: input.uploadedBy,
      takenAt: input.takenAt ? new Date(input.takenAt) : undefined
    });

    try {
      const readyPhoto = await this.photoRepository.markReady(photo.id);

      await auditLogService.write({
        timestamp: new Date().toISOString(),
        userId: input.uploadedBy,
        action: "photo.upload",
        entityType: "photo",
        entityId: readyPhoto.id,
        metadata: {
          albumId: readyPhoto.albumId,
          originalPath: readyPhoto.originalPath
        }
      });

      return readyPhoto;
    } catch (error) {
      await this.photoRepository.markFailed(photo.id);
      throw error;
    }
  }

  listPublicByAlbumSlug(slug: string) {
    return this.photoRepository.findPublicByAlbumSlug(slug);
  }

  listAdminOptionsByAlbumId(albumId: string) {
    return this.photoRepository.listAdminOptionsByAlbumId(albumId);
  }
}

export const photoService = new PhotoService();
