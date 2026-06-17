"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CategorySummary } from "@modules/categories/types";

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

type Props = {
  categories: CategorySummary[];
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    fieldTitle: string;
    fieldDescription: string;
    fieldYear: string;
    fieldEventDate: string;
    fieldVisibility: string;
    visibilityPrivate: string;
    visibilityPublic: string;
    fieldCategory: string;
    noCategory: string;
    fieldTags: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    tagsPlaceholder: string;
    saving: string;
    submit: string;
    created: string;
    failed: string;
  };
};

export function AdminAlbumForm({ categories, labels }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          setError(null);
          setSuccess(null);

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

          const response = await fetch("/api/admin/albums", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? labels.failed);
            return;
          }

          event.currentTarget.reset();
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
        <span>{labels.fieldDescription}</span>
        <textarea name="description" placeholder={labels.descriptionPlaceholder} rows={4} />
      </label>
      <div className="admin-form-grid">
        <label>
          <span>{labels.fieldEventDate}</span>
          <input name="eventDate" type="date" />
        </label>
        <label>
          <span>{labels.fieldVisibility}</span>
          <select defaultValue="private" name="visibility">
            <option value="private">{labels.visibilityPrivate}</option>
            <option value="public">{labels.visibilityPublic}</option>
          </select>
        </label>
      </div>
      <label>
        <span>{labels.fieldCategory}</span>
        <select name="categoryId">
          <option value="">{labels.noCategory}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{labels.fieldTags}</span>
        <input name="tags" placeholder={labels.tagsPlaceholder} type="text" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.saving : labels.submit}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
    </form>
  );
}
