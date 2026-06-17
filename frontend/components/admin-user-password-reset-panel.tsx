"use client";

import { useEffect, useState, useTransition } from "react";

type AdminUser = {
  id: string;
  username: string;
  role: "root" | "admin";
};

type Labels = {
  resetTitle: string;
  resetDescription: string;
  newPassword: string;
  confirmPassword: string;
  resetSubmit: string;
  resetSubmitting: string;
  resetSuccess: string;
  resetFailed: string;
  mismatch: string;
  newPlaceholder: string;
};

type Props = {
  labels: Labels;
};

export function AdminUserPasswordResetPanel({ labels }: Props) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { items?: AdminUser[] }) => {
        setUsers(data.items ?? []);
      })
      .catch(() => {});
  }, []);

  const selectedUser = users.find((u) => u.id === selectedId);

  return (
    <div>
      <h2>{labels.resetTitle}</h2>
      <p className="form-note">{labels.resetDescription}</p>
      <form
        className="admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const newPassword = String(form.get("newPassword") ?? "");
          const confirmPassword = String(form.get("confirmPassword") ?? "");

          if (newPassword !== confirmPassword) {
            setError(labels.mismatch);
            return;
          }

          if (!selectedId) return;

          startTransition(async () => {
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/admin/users/${selectedId}/password`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ newPassword })
            });

            if (!response.ok) {
              const data = (await response.json().catch(() => null)) as { error?: string } | null;
              setError(data?.error ?? labels.resetFailed);
              return;
            }

            (event.target as HTMLFormElement).reset();
            setSelectedId("");
            setSuccess(`${labels.resetSuccess} ${selectedUser?.username ?? ""}`);
          });
        }}
      >
        <label>
          <span>{labels.resetTitle.split(" ").slice(-1)[0] === "password" ? "User" : "Пользователь"}</span>
          <select
            name="userId"
            onChange={(e) => setSelectedId(e.target.value)}
            required
            value={selectedId}
          >
            <option value="">—</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{labels.newPassword}</span>
          <input autoComplete="new-password" minLength={8} name="newPassword" placeholder={labels.newPlaceholder} required type="password" />
        </label>
        <label>
          <span>{labels.confirmPassword}</span>
          <input autoComplete="new-password" minLength={8} name="confirmPassword" placeholder={labels.newPlaceholder} required type="password" />
        </label>
        <button disabled={isPending || !selectedId} type="submit">
          {isPending ? labels.resetSubmitting : labels.resetSubmit}
        </button>
        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
      </form>
    </div>
  );
}
