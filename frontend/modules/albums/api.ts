import { apiFetch } from "@modules/api/client";
import type { AlbumDetail, AlbumSummary } from "@modules/albums/types";

type AlbumListResponse = { items: AlbumSummary[] };
type AlbumDetailResponse = { album: AlbumDetail };

export const fetchAlbums = (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch<AlbumListResponse>(`/albums${query}`);
};

export const fetchAlbum = (id: string) => apiFetch<AlbumDetailResponse>(`/albums/${id}`);
