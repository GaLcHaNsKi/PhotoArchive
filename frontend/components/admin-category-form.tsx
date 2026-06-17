"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  labels: {
    name: string;
    slug: string;
    create: string;
    saving: string;
    created: string;
    failed: string;
    namePlaceholder: string;
    slugPlaceholder: string;
  };
};

export function AdminCategoryForm({ labels }: Props) {
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

          const response = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: String(form.get("name") ?? ""),
              slug: String(form.get("slug") ?? "")
            })
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
        <span>{labels.name}</span>
        <input name="name" placeholder={labels.namePlaceholder} required type="text" />
      </label>
      <label>
        <span>{labels.slug}</span>
        <input name="slug" placeholder={labels.slugPlaceholder} pattern="[a-z0-9-]+" required type="text" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.saving : labels.create}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
    </form>
  );
}
