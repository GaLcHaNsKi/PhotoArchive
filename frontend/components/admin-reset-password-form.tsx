"use client";

import { useState, useTransition } from "react";

type Props = {
  userId: string;
  username: string;
  labels: {
    newPassword: string;
    confirmPassword: string;
    submit: string;
    submitting: string;
    success: string;
    failed: string;
    mismatch: string;
    newPlaceholder: string;
  };
};

export function AdminResetPasswordForm({ userId, username, labels }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
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

        startTransition(async () => {
          setError(null);
          setSuccess(null);

          const response = await fetch(`/api/admin/users/${userId}/password`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ newPassword })
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? labels.failed);
            return;
          }

          (event.target as HTMLFormElement).reset();
          setSuccess(`${labels.success} ${username}`);
        });
      }}
    >
      <label>
        <span>{labels.newPassword}</span>
        <input autoComplete="new-password" minLength={8} name="newPassword" placeholder={labels.newPlaceholder} required type="password" />
      </label>
      <label>
        <span>{labels.confirmPassword}</span>
        <input autoComplete="new-password" minLength={8} name="confirmPassword" placeholder={labels.newPlaceholder} required type="password" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.submitting : labels.submit}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
    </form>
  );
}
