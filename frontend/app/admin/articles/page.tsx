import { AdminArticleForm } from "@components/admin-article-form";
import { AdminArticlesList } from "@components/admin-articles-list";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminArticlesPage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();

  return (
    <main className="page-content">
      <section className="section-block compact admin-layout wide">
        <div>
          <p className="eyebrow">{dictionary.adminArticles.eyebrow}</p>
          <h1>{dictionary.adminArticles.title}</h1>
          <p>{dictionary.adminArticles.description}</p>
          <AdminArticleForm labels={dictionary.adminArticles} />
        </div>
        <div className="admin-side-panel">
          <AdminArticlesList labels={dictionary.adminArticles} />
        </div>
      </section>
    </main>
  );
}
