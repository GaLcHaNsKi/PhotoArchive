import { apiFetch } from "@modules/api/client";
import type { ArticleDetail, ArticleSummary } from "@modules/articles/types";

type ArticleListResponse = { items: ArticleSummary[] };
type ArticleDetailResponse = { article: ArticleDetail };

export const fetchArticles = (search?: string, tag?: string) => {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiFetch<ArticleListResponse>(`/articles${query}`);
};

export const fetchArticle = (slug: string) => apiFetch<ArticleDetailResponse>(`/articles/${slug}`);
