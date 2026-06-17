"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Album = {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  eventDate: string | null;
  visibility: "public" | "private";
  tags: string[];
  category: { id: string; name: string } | null;
  _count: { photos: number };
};

type CategoryOption = {
  id: string;
  name: string;
};

type Labels = {
  manageTitle: string;
  edit: string;
  saveChanges: string;
  saving: string;
  updated: string;
  updateFailed: string;
  delete: string;
  confirm: string;
  cancel: string;
  deleting: string;
  deleted: string;
  deleteFailed: string;
  loadFailed: string;
  noItems: string;
  photos: string;
  fieldTitle: string;
  fieldDescription: string;
  fieldYear: string;
  fieldEventDate: string;
  fieldVisibility: string;
  visibilityPublic: string;
  visibilityPrivate: string;
  fieldCategory: string;
  noCategory: string;
  fieldTags: string;
};

type Props = {
  categories: CategoryOption[];
  labels: Labels;
};

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function AdminAlbumsList({ categories, labels }: Props) {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    setIsLoading(true);
    fetch("/api/admin/albums/list", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { items?: Album[]; error?: string }) => {
        setAlbums(data.items ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setLoadError(labels.loadFailed);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const yearValue = String(form.get("year") ?? "").trim();
    const eventDateValue = String(form.get("eventDate") ?? "").trim();

    const payload = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? "") || undefined,
      year: yearValue ? Number(yearValue) : undefined,
      eventDate: eventDateValue ? new Date(eventDateValue).toISOString() : undefined,
      visibility: String(form.get("visibility") ?? "private"),
      categoryId: String(form.get("categoryId") ?? "") || undefined,
      tags: splitCsv(String(form.get("tags") ?? ""))
    };

    startTransition(async () => {
      setEditError(null);
      setEditSuccess(null);

      const response = await fetch(`/api/admin/albums/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setEditError(data?.error ?? labels.updateFailed);
        return;
      }

      setEditSuccess(labels.updated);
      setEditingId(null);
      load();
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      setDeleteError(null);

      const response = await fetch(`/api/admin/albums/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setDeleteError(data?.error ?? labels.deleteFailed);
        setDeletingId(null);
        setConfirmingId(null);
        return;
      }

      setConfirmingId(null);
      setDeletingId(null);
      load();
      router.refresh();
    });
  };

  if (isLoading) return <p className="form-note">…</p>;
  if (loadError) return <p className="form-error">{loadError}</p>;
  if (albums.length === 0) return <p className="form-note">{labels.noItems}</p>;

  return (
    <div className="admin-list">
      <h2>{labels.manageTitle}</h2>
      {editSuccess ? <p className="form-success">{editSuccess}</p> : null}
      {editError ? <p className="form-error">{editError}</p> : null}
      {deleteError ? <p className="form-error">{deleteError}</p> : null}
      <div className="admin-list-stack">
        {albums.map((album) => (
          <div className="admin-list-row" key={album.id}>
            <div className="admin-list-row-header">
              <div className="admin-list-row-info">
                <strong>{album.title}</strong>
                <span className="form-note">
                  {album.visibility === "public" ? labels.visibilityPublic : labels.visibilityPrivate} · {album._count.photos} {labels.photos}
                  {album.category ? ` · ${album.category.name}` : ""}
                </span>
              </div>
              <span className="admin-inline-actions">
                {editingId !== album.id ? (
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setEditingId(album.id);
                      setEditSuccess(null);
                      setEditError(null);
                    }}
                  >
                    {labels.edit}
                  </button>
                ) : (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    {labels.cancel}
                  </button>
                )}
                {confirmingId === album.id ? (
                  <>
                    <button
                      className="btn-danger btn-sm"
                      disabled={deletingId === album.id}
                      onClick={() => handleDelete(album.id)}
                    >
                      {deletingId === album.id ? labels.deleting : labels.confirm}
                    </button>
                    <button className="btn-ghost btn-sm" onClick={() => setConfirmingId(null)}>
                      {labels.cancel}
                    </button>
                  </>
                ) : (
                  <button className="btn-danger btn-sm" onClick={() => setConfirmingId(album.id)}>
                    {labels.delete}
                  </button>
                )}
              </span>
            </div>

            {editingId === album.id ? (
              <form
                className="admin-form admin-inline-edit"
                onSubmit={(e) => handleEdit(e, album.id)}
              >
                <label>
                  <span>{labels.fieldTitle}</span>
                  <input defaultValue={album.title} name="title" required type="text" />
                </label>
                <label>
                  <span>{labels.fieldDescription}</span>
                  <textarea defaultValue={album.description ?? ""} name="description" rows={3} />
                </label>
                <div className="admin-form-grid">
                  <label>
                    <span>{labels.fieldYear}</span>
                    <input defaultValue={album.year ?? ""} max={2100} min={1900} name="year" type="number" />
                  </label>
                  <label>
                    <span>{labels.fieldEventDate}</span>
                    <input
                      defaultValue={album.eventDate ? album.eventDate.slice(0, 10) : ""}
                      name="eventDate"
                      type="date"
                    />
                  </label>
                  <label>
                    <span>{labels.fieldVisibility}</span>
                    <select defaultValue={album.visibility} name="visibility">
                      <option value="private">{labels.visibilityPrivate}</option>
                      <option value="public">{labels.visibilityPublic}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{labels.fieldCategory}</span>
                  <select defaultValue={album.category?.id ?? ""} name="categoryId">
                    <option value="">{labels.noCategory}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{labels.fieldTags}</span>
                  <input defaultValue={album.tags.join(", ")} name="tags" type="text" />
                </label>
                <button disabled={isPending} type="submit">
                  {isPending ? labels.saving : labels.saveChanges}
                </button>
              </form>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
