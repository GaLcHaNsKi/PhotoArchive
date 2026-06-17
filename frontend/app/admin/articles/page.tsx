import { AdminArticleForm } from "@components/admin-article-form";
import { ArticleCard } from "@components/article-card";
import { fetchArticles } from "@modules/articles/api";
import { getI18n } from "@modules/i18n/server";
import { requireAdminUser } from "@modules/admin/session";

export default async function AdminArticlesPage() {
  const { dictionary } = await getI18n();
  await requireAdminUser();
  const { items } = await fetchArticles();

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
          <h2>{dictionary.adminArticles.latestPublic}</h2>
          <div className="article-stack">
            {items.map((article) => (
              <ArticleCard article={article} key={article.id} labels={dictionary.articleCard} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
