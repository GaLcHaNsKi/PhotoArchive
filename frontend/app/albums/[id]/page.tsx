import Link from "next/link";

import { InfinitePhotoGrid } from "@components/infinite-photo-grid";
import { mediaUrl } from "@modules/api/client";
import { fetchAlbum } from "@modules/albums/api";
import { getI18n } from "@modules/i18n/server";

export const dynamic = "force-dynamic";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { dictionary } = await getI18n();
  const { id } = await params;
  const { album } = await fetchAlbum(id);

  return (
    <main className="page-content">
      <section className="album-hero">
        <div className="album-hero-copy">
          <Link href="/albums">{dictionary.albums.back}</Link>
          <p className="eyebrow">{album.category?.name ?? dictionary.albums.archiveFallback}</p>
          <h1>{album.title}</h1>
          <p>{album.description ?? dictionary.albums.noDescription}</p>
        </div>
        {album.coverPhoto ? (
          <img alt={album.title} className="album-hero-image" src={mediaUrl(album.coverPhoto.previewPath)} />
        ) : null}
      </section>
      <section className="section-block compact">
        <div className="section-heading">
          <h2>{dictionary.albums.gallery}</h2>
          <span>
            {album.photos.length} {dictionary.albums.imagesSuffix}
          </span>
        </div>
        <InfinitePhotoGrid photos={album.photos} />
      </section>
    </main>
  );
}
