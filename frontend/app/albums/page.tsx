import { AlbumCard } from "@components/album-card";
import { fetchAlbums } from "@modules/albums/api";
import { getI18n } from "@modules/i18n/server";

export const dynamic = "force-dynamic";

export default async function AlbumsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { dictionary } = await getI18n();
  const params = await searchParams;
  const { items } = await fetchAlbums(params.search);

  return (
    <main className="page-content">
      <section className="section-block compact">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{dictionary.albums.eyebrow}</p>
            <h1>{dictionary.albums.title}</h1>
          </div>
        </div>
        <div className="album-grid">
          {items.map((album) => (
            <AlbumCard album={album} key={album.id} labels={dictionary.albumCard} />
          ))}
        </div>
      </section>
    </main>
  );
}
