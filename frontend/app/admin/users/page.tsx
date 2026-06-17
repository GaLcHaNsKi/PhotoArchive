import { redirect } from "next/navigation";

import { AdminUserForm } from "@components/admin-user-form";
import { AdminUserPasswordResetPanel } from "@components/admin-user-password-reset-panel";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminUsersPage() {
  const { dictionary } = await getI18n();
  const user = await requireAdminUser();

  if (user.role !== "root") {
    redirect("/admin");
  }

  return (
    <main className="page-content">
      <section className="section-block compact admin-layout">
        <div>
          <p className="eyebrow">{dictionary.adminUsers.eyebrow}</p>
          <h1>{dictionary.adminUsers.title}</h1>
          <p>{dictionary.adminUsers.description}</p>
          <AdminUserForm labels={dictionary.adminUsers} />
        </div>
        <div className="admin-side-panel">
          <AdminUserPasswordResetPanel labels={dictionary.adminUsers} />
        </div>
      </section>
    </main>
  );
}
