import { redirect } from "next/navigation";

import { AdminUserForm } from "@components/admin-user-form";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminUsersPage() {
  const user = await requireAdminUser();

  if (user.role !== "root") {
    redirect("/admin");
  }

  return (
    <main className="page-content">
      <section className="section-block compact admin-panel">
        <p className="eyebrow">Root tools</p>
        <h1>Create admin accounts</h1>
        <p>Accounts are active immediately and can sign in through the admin login page.</p>
        <AdminUserForm />
      </section>
    </main>
  );
}
