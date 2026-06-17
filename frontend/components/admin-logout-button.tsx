"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  labels: {
    signOut: string;
    signingOut: string;
    logoutFailed: string;
  };
};

export function AdminLogoutButton({ labels }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-inline-actions">
      <button
        className="secondary-button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            setError(null);

            const response = await fetch("/api/admin/logout", {
              method: "POST"
            });

            if (!response.ok) {
              setError(labels.logoutFailed);
              return;
            }

            router.push("/admin/login");
            router.refresh();
          });
        }}
        type="button"
      >
        {isPending ? labels.signingOut : labels.signOut}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
