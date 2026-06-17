"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  labels: {
    username: string;
    password: string;
    creating: string;
    create: string;
    created: string;
    failed: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
  };
};

export function AdminUserForm({ labels }: Props) {
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

          const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              username: String(form.get("username") ?? ""),
              password: String(form.get("password") ?? "")
            })
          });

          const data = (await response.json().catch(() => null)) as { error?: string } | null;

          if (!response.ok) {
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
        <span>{labels.username}</span>
        <input name="username" placeholder={labels.usernamePlaceholder} required type="text" />
      </label>
      <label>
        <span>{labels.password}</span>
        <input name="password" placeholder={labels.passwordPlaceholder} required type="password" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.creating : labels.create}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
    </form>
  );
}
