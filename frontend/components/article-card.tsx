import Link from "next/link";

import { mediaUrl } from "@modules/api/client";
import type { ArticleSummary } from "@modules/articles/types";

type Props = {
  article: ArticleSummary;
  labels: {
    fallback: string;
    editorialStory: string;
    summaryFallback: string;
  };
};

export function ArticleCard({ article, labels }: Props) {
  return (
    <Link className="article-card" href={`/articles/${article.id}`}>
      <div className="article-art">
        {article.coverPhoto ? (
          <img alt={article.title} loading="lazy" src={mediaUrl(article.coverPhoto.thumbnailPath)} />
        ) : (
          <div className="album-fallback">{labels.fallback}</div>
        )}
      </div>
      <div className="article-copy">
        <p className="eyebrow">{article.album?.title ?? labels.editorialStory}</p>
        <h3>{article.title}</h3>
        <p>{article.summary ?? labels.summaryFallback}</p>
        <div className="tag-row">
          {article.tags.slice(0, 3).map((tag) => (
            <span className="tag-chip" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
