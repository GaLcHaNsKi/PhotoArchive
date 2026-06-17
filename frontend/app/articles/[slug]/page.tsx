import Link from "next/link";

import { InfinitePhotoGrid } from "@components/infinite-photo-grid";
import { fetchArticle } from "@modules/articles/api";
import { mediaUrl } from "@modules/api/client";
import { getI18n } from "@modules/i18n/server";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { dictionary } = await getI18n();
  const { slug } = await params;
  const { article } = await fetchArticle(slug);

  return (
    <main className="page-content">
      <section className="article-hero">
        <div className="article-hero-copy">
          <Link href="/articles">{dictionary.articles.back}</Link>
          <p className="eyebrow">{article.album?.title ?? dictionary.articles.editorialStory}</p>
          <h1>{article.title}</h1>
          <p>{article.summary ?? dictionary.articles.summaryFallback}</p>
          <div className="tag-row">
            {article.tags.map((tag) => (
              <span className="tag-chip" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {article.coverPhoto ? <img alt={article.title} className="album-hero-image" src={mediaUrl(article.coverPhoto.previewPath)} /> : null}
      </section>
      <section className="section-block article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      {article.photos.length > 0 ? (
        <section className="section-block compact">
          <div className="section-heading">
            <h2>{dictionary.articles.linkedPhotos}</h2>
            <span>
              {article.photos.length} {dictionary.articles.imagesSuffix}
            </span>
          </div>
          <InfinitePhotoGrid photos={article.photos} />
        </section>
      ) : null}
    </main>
  );
}
