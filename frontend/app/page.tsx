import Link from "next/link";

import { AlbumCard } from "@components/album-card";
import { ArticleCard } from "@components/article-card";
import { fetchAlbums } from "@modules/albums/api";
import { fetchArticles } from "@modules/articles/api";
import { fetchCategories } from "@modules/categories/api";
import { getI18n } from "@modules/i18n/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { dictionary } = await getI18n();
  const { items } = await fetchAlbums();
  const { items: articles } = await fetchArticles();
  const { items: categories } = await fetchCategories();
  const featured = items.slice(0, 3);
  const featuredArticles = articles.slice(0, 2);

  return (
    <main className="page-content">
      <section className="hero">
        <div>
          <p className="eyebrow">{dictionary.home.eyebrow}</p>
          <h1>{dictionary.home.title}</h1>
          <p className="hero-copy">{dictionary.home.copy}</p>
        </div>
        <div className="hero-panel">
          <p>{dictionary.home.panelCopy}</p>
          <Link href="/albums">{dictionary.home.openArchive}</Link>
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <h2>{dictionary.home.featuredAlbums}</h2>
          <Link href="/albums">{dictionary.home.allAlbums}</Link>
        </div>
        <div className="album-grid">
          {featured.map((album) => (
            <AlbumCard album={album} key={album.id} labels={dictionary.albumCard} />
          ))}
        </div>
      </section>
      <section className="section-block compact">
        <div className="section-heading">
          <h2>{dictionary.home.categories}</h2>
          <Link href="/albums">{dictionary.home.browseCatalog}</Link>
        </div>
        <div className="tag-row">
          {categories.map((category) => (
            <span className="tag-chip" key={category.id}>
              {category.name} · {category._count?.albums ?? 0}
            </span>
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <h2>{dictionary.home.recentStories}</h2>
          <Link href="/articles">{dictionary.home.allArticles}</Link>
        </div>
        <div className="article-grid">
          {featuredArticles.map((article) => (
            <ArticleCard article={article} key={article.id} labels={dictionary.articleCard} />
          ))}
        </div>
      </section>
    </main>
  );
}
