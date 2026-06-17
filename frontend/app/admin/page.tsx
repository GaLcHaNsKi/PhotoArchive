import Link from "next/link";

import { AdminLogoutButton } from "@components/admin-logout-button";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminDashboardPage() {
  const { dictionary } = await getI18n();
  const user = await requireAdminUser();

  return (
    <main className="page-content">
      <section className="section-block compact admin-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{dictionary.admin.workspace}</p>
            <h1>{dictionary.admin.controlRoom}</h1>
          </div>
          <AdminLogoutButton labels={dictionary.admin} />
        </div>
        <p>
          {dictionary.admin.signedInAs} <strong>{user.username}</strong> {dictionary.admin.withRole} <strong>{user.role}</strong>. {dictionary.admin.toolsHint}
        </p>
        <div className="admin-link-grid">
          {user.role === "root" ? (
            <Link className="admin-link-card" href="/admin/users">
              <h3>{dictionary.admin.accountsTitle}</h3>
              <p>{dictionary.admin.accountsCopy}</p>
            </Link>
          ) : null}
          <Link className="admin-link-card" href="/admin/categories">
            <h3>{dictionary.admin.categoriesTitle}</h3>
            <p>{dictionary.admin.categoriesCopy}</p>
          </Link>
          <Link className="admin-link-card" href="/admin/articles">
            <h3>{dictionary.admin.articlesTitle}</h3>
            <p>{dictionary.admin.articlesCopy}</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
