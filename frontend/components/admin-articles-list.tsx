"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Article = {
  id: string;
  title: string;
  summary: string | null;
  contentHtml: string;
  visibility: "public" | "private";
  tags: string[];
  createdAt: string;
  publishedAt: string | null;
  coverPhoto: { id: string; title: string } | null;
  album: { id: string; title: string } | null;
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
  deleteFailed: string;
  loadFailed: string;
  noItems: string;
  fieldTitle: string;
  fieldSummary: string;
  fieldContentHtml: string;
  fieldVisibility: string;
  visibilityPublic: string;
  visibilityPrivate: string;
  fieldTags: string;
  titlePlaceholder: string;
  summaryPlaceholder: string;
  contentPlaceholder: string;
  tagsPlaceholder: string;
};

type Props = {
  labels: Labels;
};

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function AdminArticlesList({ labels }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
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
    fetch("/api/admin/articles/list", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { items?: Article[]; error?: string }) => {
        setArticles(data.items ?? []);
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

    const payload = {
      title: String(form.get("title") ?? ""),
      summary: String(form.get("summary") ?? "") || undefined,
      contentHtml: String(form.get("contentHtml") ?? ""),
      visibility: String(form.get("visibility") ?? "private"),
      tags: splitCsv(String(form.get("tags") ?? ""))
    };

    startTransition(async () => {
      setEditError(null);
      setEditSuccess(null);

      const response = await fetch(`/api/admin/articles/${id}`, {
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

      const response = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });

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
  if (articles.length === 0) return <p className="form-note">{labels.noItems}</p>;

  return (
    <div className="admin-list">
      <h2>{labels.manageTitle}</h2>
      {editSuccess ? <p className="form-success">{editSuccess}</p> : null}
      {editError ? <p className="form-error">{editError}</p> : null}
      {deleteError ? <p className="form-error">{deleteError}</p> : null}
      <div className="admin-list-stack">
        {articles.map((article) => (
          <div className="admin-list-row" key={article.id}>
            <div className="admin-list-row-header">
              <div className="admin-list-row-info">
                <strong>{article.title}</strong>
                <span className="form-note">
                  {article.visibility === "public" ? labels.visibilityPublic : labels.visibilityPrivate}
                  {article.album ? ` · ${article.album.title}` : ""}
                </span>
              </div>
              <span className="admin-inline-actions">
                {editingId !== article.id ? (
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setEditingId(article.id);
                      setEditSuccess(null);
                      setEditError(null);
                    }}
                  >
                    {labels.edit}
                  </button>
                ) : (
                  <button className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                    {labels.cancel}
                  </button>
                )}
                {confirmingId === article.id ? (
                  <>
                    <button
                      className="btn-danger btn-sm"
                      disabled={deletingId === article.id}
                      onClick={() => handleDelete(article.id)}
                    >
                      {deletingId === article.id ? labels.deleting : labels.confirm}
                    </button>
                    <button className="btn-ghost btn-sm" onClick={() => setConfirmingId(null)}>
                      {labels.cancel}
                    </button>
                  </>
                ) : (
                  <button className="btn-danger btn-sm" onClick={() => setConfirmingId(article.id)}>
                    {labels.delete}
                  </button>
                )}
              </span>
            </div>

            {editingId === article.id ? (
              <form
                className="admin-form admin-inline-edit"
                onSubmit={(e) => handleEdit(e, article.id)}
              >
                <label>
                  <span>{labels.fieldTitle}</span>
                  <input defaultValue={article.title} name="title" required type="text" />
                </label>
                <label>
                  <span>{labels.fieldSummary}</span>
                  <input defaultValue={article.summary ?? ""} name="summary" placeholder={labels.summaryPlaceholder} type="text" />
                </label>
                <label>
                  <span>{labels.fieldContentHtml}</span>
                  <textarea defaultValue={article.contentHtml} name="contentHtml" placeholder={labels.contentPlaceholder} required rows={6} />
                </label>
                <div className="admin-form-grid">
                  <label>
                    <span>{labels.fieldVisibility}</span>
                    <select defaultValue={article.visibility} name="visibility">
                      <option value="private">{labels.visibilityPrivate}</option>
                      <option value="public">{labels.visibilityPublic}</option>
                    </select>
                  </label>
                  <label>
                    <span>{labels.fieldTags}</span>
                    <input defaultValue={article.tags.join(", ")} name="tags" placeholder={labels.tagsPlaceholder} type="text" />
                  </label>
                </div>
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
