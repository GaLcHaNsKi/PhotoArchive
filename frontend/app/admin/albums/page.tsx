import { AdminAlbumForm } from "@components/admin-album-form";
import { AdminAlbumsList } from "@components/admin-albums-list";
import { fetchCategories } from "@modules/categories/api";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminAlbumsPage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();
  const { items: categories } = await fetchCategories();

  return (
    <main className="page-content">
      <section className="section-block compact admin-layout">
        <div>
          <p className="eyebrow">{dictionary.adminAlbums.eyebrow}</p>
          <h1>{dictionary.adminAlbums.title}</h1>
          <p>{dictionary.adminAlbums.description}</p>
          <AdminAlbumForm categories={categories} labels={dictionary.adminAlbums} />
        </div>
        <div className="admin-side-panel">
          <AdminAlbumsList categories={categories} labels={dictionary.adminAlbums} />
        </div>
      </section>
    </main>
  );
}
