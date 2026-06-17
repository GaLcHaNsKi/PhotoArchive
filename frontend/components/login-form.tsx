"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type Props = {
  labels: {
    username: string;
    password: string;
    signIn: string;
    signingIn: string;
    loginFailed: string;
  };
};

export function LoginForm({ labels }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      username: String(form.get("username") ?? ""),
      password: String(form.get("password") ?? "")
    };

    startTransition(async () => {
      setError(null);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? labels.loginFailed);
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        <span>{labels.username}</span>
        <input name="username" placeholder="archive-admin" required type="text" />
      </label>
      <label>
        <span>{labels.password}</span>
        <input name="password" required type="password" />
      </label>
      <button disabled={isPending} type="submit">
        {isPending ? labels.signingIn : labels.signIn}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
