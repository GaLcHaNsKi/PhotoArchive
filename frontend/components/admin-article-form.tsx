"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type AlbumOption = {
  id: string;
  title: string;
  slug: string;
  visibility: "public" | "private";
  _count?: { photos: number };
};

type PhotoOption = {
  id: string;
  title: string;
};

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

type Props = {
  labels: {
    fieldTitle: string;
    fieldSlug: string;
    fieldSummary: string;
    fieldContentHtml: string;
    fieldVisibility: string;
    visibilityPrivate: string;
    visibilityPublic: string;
    fieldAlbum: string;
    noAlbum: string;
    fieldCoverPhoto: string;
    noCover: string;
    fieldTags: string;
    fieldLinkedPhotos: string;
    pickAlbumHint: string;
    titlePlaceholder: string;
    slugPlaceholder: string;
    summaryPlaceholder: string;
    contentPlaceholder: string;
    tagsPlaceholder: string;
    saving: string;
    submit: string;
    created: string;
    failed: string;
    loadAlbumsFailed: string;
    loadPhotosFailed: string;
    private: string;
    public: string;
  };
};

export function AdminArticleForm({ labels }: Props) {
  const router = useRouter();
  const [albums, setAlbums] = useState<AlbumOption[]>([]);
  const [photos, setPhotos] = useState<PhotoOption[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
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
  }, []);

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
  }, [selectedAlbumId]);

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch("/api/admin/articles", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              title: String(form.get("title") ?? ""),
              slug: String(form.get("slug") ?? ""),
              summary: String(form.get("summary") ?? "") || undefined,
              contentHtml: String(form.get("contentHtml") ?? ""),
              visibility: String(form.get("visibility") ?? "private"),
              albumId: String(form.get("albumId") ?? "") || undefined,
              coverPhotoId: String(form.get("coverPhotoId") ?? "") || undefined,
              tags: splitCsv(String(form.get("tags") ?? "")),
              photoIds: form
                .getAll("photoIds")
                .map((item) => String(item))
                .filter(Boolean)
            })
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? labels.failed);
            return;
          }

          event.currentTarget.reset();
          setSelectedAlbumId("");
          setPhotos([]);
          setSuccess(labels.created);
          router.refresh();
        });
      }}
    >
      <label>
        <span>{labels.fieldTitle}</span>
        <input name="title" placeholder={labels.titlePlaceholder} required type="text" />
      </label>
      <label>
        <span>{labels.fieldSlug}</span>
        <input name="slug" placeholder={labels.slugPlaceholder} pattern="[a-z0-9-]+" required type="text" />
      </label>
      <label>
        <span>{labels.fieldSummary}</span>
        <textarea name="summary" placeholder={labels.summaryPlaceholder} rows={3} />
      </label>
      <label>
        <span>{labels.fieldContentHtml}</span>
        <textarea name="contentHtml" placeholder={labels.contentPlaceholder} required rows={8} />
      </label>
      <div className="admin-form-grid">
        <label>
          <span>{labels.fieldVisibility}</span>
          <select defaultValue="private" name="visibility">
            <option value="private">{labels.visibilityPrivate}</option>
            <option value="public">{labels.visibilityPublic}</option>
          </select>
        </label>
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
          <span>{labels.fieldCoverPhoto}</span>
          <select disabled={!selectedAlbumId || isLoadingPhotos || isPending} name="coverPhotoId">
            <option value="">{labels.noCover}</option>
            {photos.map((photo) => (
              <option key={photo.id} value={photo.id}>
                {photo.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>{labels.fieldTags}</span>
        <input name="tags" placeholder={labels.tagsPlaceholder} type="text" />
      </label>
      <label>
        <span>{labels.fieldLinkedPhotos}</span>
        <select disabled={!selectedAlbumId || isLoadingPhotos || isPending} multiple name="photoIds" size={Math.min(8, Math.max(4, photos.length || 4))}>
          {photos.map((photo) => (
            <option key={photo.id} value={photo.id}>
              {photo.title}
            </option>
          ))}
        </select>
      </label>
      {!selectedAlbumId ? <p className="form-note">{labels.pickAlbumHint}</p> : null}
      <button disabled={isPending} type="submit">
        {isPending ? labels.saving : labels.submit}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
    </form>
  );
}
