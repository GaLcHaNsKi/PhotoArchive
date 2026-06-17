export type PhotoAsset = {
  id: string;
  title: string;
  description: string | null;
  previewPath: string;
  thumbnailPath: string;
  width: number | null;
  height: number | null;
};

export type AlbumSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number | null;
  eventDate: string | null;
  tags: string[];
  category: { id: string; name: string; slug: string } | null;
  coverPhoto: PhotoAsset | null;
  _count?: { photos: number };
};

export type AlbumDetail = AlbumSummary & {
  photos: PhotoAsset[];
};
