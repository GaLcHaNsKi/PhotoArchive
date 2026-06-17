"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { mediaUrl } from "@modules/api/client";

type AlbumOption = {
  id: string;
  title: string;
  visibility: "public" | "private";
};

type PhotoOption = {
  id: string;
  title: string;
  thumbnailPath: string;
  createdAt: string;
};

type Props = {
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    fieldTitle: string;
    fieldDescription: string;
    fieldAlbum: string;
    noAlbum: string;
    fieldTakenAt: string;
    fieldFile: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    upload: string;
    uploading: string;
    uploaded: string;
    failed: string;
    loadAlbumsFailed: string;
    loadPhotosFailed: string;
    previewTitle: string;
    previewHint: string;
    noPhotos: string;
    uploadedAt: string;
    private: string;
    public: string;
  };
};

export function AdminPhotoUploadForm({ labels }: Props) {
  const router = useRouter();
  const [albums, setAlbums] = useState<AlbumOption[]>([]);
  const [photos, setPhotos] = useState<PhotoOption[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const loadAlbums = async () => {
      setIsLoadingAlbums(true);
      const response = await fetch("/api/admin/albums", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as { items?: AlbumOption[]; error?: string } | null;

      if (!response.ok) {
        if (isMounted) {
          setError(data?.error ?? labels.loadAlbumsFailed);
          setIsLoadingAlbums(false);
        }
        return;
      }

      if (isMounted) {
        setAlbums(data?.items ?? []);
        setIsLoadingAlbums(false);
      }
    };

    loadAlbums().catch(() => {
      if (isMounted) {
        setError(labels.loadAlbumsFailed);
        setIsLoadingAlbums(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [labels.loadAlbumsFailed]);

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      if (!selectedAlbumId) {
        setPhotos([]);
        return;
      }

      setIsLoadingPhotos(true);
      const response = await fetch(`/api/admin/photos?albumId=${encodeURIComponent(selectedAlbumId)}`, { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as { items?: PhotoOption[]; error?: string } | null;

      if (!response.ok) {
        if (isMounted) {
          setError(data?.error ?? labels.loadPhotosFailed);
          setIsLoadingPhotos(false);
        }
        return;
      }

      if (isMounted) {
        setPhotos(data?.items ?? []);
        setIsLoadingPhotos(false);
      }
    };

    loadPhotos().catch(() => {
      if (isMounted) {
        setError(labels.loadPhotosFailed);
        setIsLoadingPhotos(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedAlbumId, refreshCounter, labels.loadPhotosFailed]);

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        const takenAtValue = String(formData.get("takenAt") ?? "").trim();
        if (takenAtValue) {
          formData.set("takenAt", new Date(takenAtValue).toISOString());
        } else {
          formData.delete("takenAt");
        }

        if (!String(formData.get("albumId") ?? "")) {
          formData.delete("albumId");
        }

        if (!String(formData.get("description") ?? "")) {
          formData.delete("description");
        }

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch("/api/admin/photos", {
            method: "POST",
            body: formData
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? labels.failed);
            return;
          }

          form.reset();
          setSuccess(labels.uploaded);
          setRefreshCounter((value) => value + 1);
          router.refresh();
        });
      }}
    >
      <label>
        <span>{labels.fieldTitle}</span>
        <input name="title" placeholder={labels.titlePlaceholder} required type="text" />
      </label>
      <label>
        <span>{labels.fieldDescription}</span>
        <textarea name="description" placeholder={labels.descriptionPlaceholder} rows={3} />
      </label>
      <div className="admin-form-grid">
        <label>
          <span>{labels.fieldAlbum}</span>
          <select
            disabled={isLoadingAlbums || isPending}
            name="albumId"
            onChange={(event) => {
              setSelectedAlbumId(event.target.value);
            }}
            value={selectedAlbumId}
          >
            <option value="">{labels.noAlbum}</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title} ({album.visibility === "public" ? labels.public : labels.private})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{labels.fieldTakenAt}</span>
          <input name="takenAt" type="date" />
        </label>
      </div>
      <label>
        <span>{labels.fieldFile}</span>
        <input accept="image/*" name="file" required type="file" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.uploading : labels.upload}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      <div className="admin-photo-preview">
        <h2>{labels.previewTitle}</h2>
        {!selectedAlbumId ? <p className="form-note">{labels.previewHint}</p> : null}
        {selectedAlbumId && isLoadingPhotos ? <p className="form-note">{labels.uploading}</p> : null}
        {selectedAlbumId && !isLoadingPhotos && photos.length === 0 ? <p className="form-note">{labels.noPhotos}</p> : null}
        {selectedAlbumId && photos.length > 0 ? (
          <div className="photo-grid admin-photo-preview-grid">
            {photos.map((photo) => (
              <figure className="photo-tile" key={photo.id}>
                <img alt={photo.title} loading="lazy" src={mediaUrl(photo.thumbnailPath)} />
                <figcaption>
                  <strong>{photo.title}</strong>
                  <span>
                    {labels.uploadedAt}: {photo.createdAt.slice(0, 10)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </form>
  );
}
