"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  categoryId: string;
  labels: {
    delete: string;
    confirm: string;
    cancel: string;
    deleting: string;
    failed: string;
  };
};

export function AdminCategoryDeleteButton({ categoryId, labels }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      setError(null);

      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? labels.failed);
        setConfirming(false);
        return;
      }

      router.refresh();
    });
  };

  if (isPending) {
    return <button className="btn-danger btn-sm" disabled>{labels.deleting}</button>;
  }

  if (confirming) {
    return (
      <span className="admin-inline-actions">
        <button className="btn-danger btn-sm" onClick={handleDelete}>{labels.confirm}</button>
        <button className="btn-ghost btn-sm" onClick={() => setConfirming(false)}>{labels.cancel}</button>
        {error ? <span className="form-error">{error}</span> : null}
      </span>
    );
  }

  return <button className="btn-danger btn-sm" onClick={() => setConfirming(true)}>{labels.delete}</button>;
}
