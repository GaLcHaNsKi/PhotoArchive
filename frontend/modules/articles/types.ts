import type { PhotoAsset } from "@modules/albums/types";

export type ArticleSummary = {
  id: string;
  title: string;
  summary: string | null;
  contentHtml?: string;
  tags: string[];
  createdAt?: string;
  publishedAt?: string | null;
  album: { id: string; title: string } | null;
  coverPhoto: PhotoAsset | null;
};

export type ArticleDetail = ArticleSummary & {
  contentHtml: string;
  photos: PhotoAsset[];
};
