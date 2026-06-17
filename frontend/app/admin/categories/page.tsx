import { AdminCategoryForm } from "@components/admin-category-form";
import { AdminCategoryDeleteButton } from "@components/admin-category-delete-button";
import { fetchCategories } from "@modules/categories/api";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminCategoriesPage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();
  const { items } = await fetchCategories();

  return (
    <main className="page-content">
      <section className="section-block compact admin-layout">
        <div>
          <p className="eyebrow">{dictionary.adminCategories.eyebrow}</p>
          <h1>{dictionary.adminCategories.title}</h1>
          <p>{dictionary.adminCategories.description}</p>
          <AdminCategoryForm labels={dictionary.adminCategories} />
        </div>
        <div className="admin-side-panel">
          <h2>{dictionary.adminCategories.currentCategories}</h2>
          <div className="category-list">
            {items.map((category) => (
              <div className="category-row" key={category.id}>
                <div>
                  <strong>{category.name}</strong>
                </div>
                <span className="admin-inline-actions">
                  <span>
                    {category._count?.albums ?? 0} {dictionary.adminCategories.albumsSuffix}
                  </span>
                  <AdminCategoryDeleteButton
                    categoryId={category.id}
                    labels={{
                      delete: dictionary.adminCategories.delete,
                      confirm: dictionary.adminCategories.confirm,
                      cancel: dictionary.adminCategories.cancel,
                      deleting: dictionary.adminCategories.deleting,
                      failed: dictionary.adminCategories.deleteFailed
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
