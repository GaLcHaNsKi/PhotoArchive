import { ArticleCard } from "@components/article-card";
import { fetchArticles } from "@modules/articles/api";
import { getI18n } from "@modules/i18n/server";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  const { dictionary } = await getI18n();
  const params = await searchParams;
  const { items } = await fetchArticles(params.search, params.tag);

  return (
    <main className="page-content">
      <section className="section-block compact">
        <p className="eyebrow">{dictionary.articles.eyebrow}</p>
        <h1>{dictionary.articles.title}</h1>
        <p>{dictionary.articles.description}</p>
        <div className="article-grid">
          {items.map((article) => (
            <ArticleCard article={article} key={article.id} labels={dictionary.articleCard} />
          ))}
        </div>
      </section>
    </main>
  );
}
