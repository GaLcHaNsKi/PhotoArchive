import { AdminPhotoUploadForm } from "@components/admin-photo-upload-form";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminPhotosPage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();

  return (
    <main className="page-content">
      <section className="section-block compact admin-panel">
        <p className="eyebrow">{dictionary.adminPhotos.eyebrow}</p>
        <h1>{dictionary.adminPhotos.title}</h1>
        <p>{dictionary.adminPhotos.description}</p>
        <AdminPhotoUploadForm labels={dictionary.adminPhotos} />
      </section>
    </main>
  );
}
