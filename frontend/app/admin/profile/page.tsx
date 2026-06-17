import { AdminChangePasswordForm } from "@components/admin-change-password-form";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminProfilePage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();

  return (
    <main className="page-content">
      <section className="section-block compact admin-panel">
        <p className="eyebrow">{dictionary.adminProfile.eyebrow}</p>
        <h1>{dictionary.adminProfile.title}</h1>
        <p>{dictionary.adminProfile.description}</p>
        <AdminChangePasswordForm labels={dictionary.adminProfile} />
      </section>
    </main>
  );
}
