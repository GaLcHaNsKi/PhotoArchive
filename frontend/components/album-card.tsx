import Link from "next/link";

import { mediaUrl } from "@modules/api/client";
import type { AlbumSummary } from "@modules/albums/types";

type Props = {
  album: AlbumSummary;
  labels: {
    fallback: string;
    publicArchive: string;
    descriptionFallback: string;
    noYear: string;
    photosSuffix: string;
  };
};

export function AlbumCard({ album, labels }: Props) {
  return (
    <Link className="album-card" href={`/albums/${album.slug}`}>
      <div className="album-art">
        {album.coverPhoto ? (
          <img alt={album.title} loading="lazy" src={mediaUrl(album.coverPhoto.thumbnailPath)} />
        ) : (
          <div className="album-fallback">{labels.fallback}</div>
        )}
      </div>
      <div className="album-copy">
        <p className="eyebrow">{album.category?.name ?? labels.publicArchive}</p>
        <h3>{album.title}</h3>
        <p>{album.description ?? labels.descriptionFallback}</p>
        <div className="album-meta">
          <span>{album.year ?? labels.noYear}</span>
          <span>
            {album._count?.photos ?? 0} {labels.photosSuffix}
          </span>
        </div>
      </div>
    </Link>
  );
}
