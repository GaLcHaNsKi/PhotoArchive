"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { mediaUrl } from "@modules/api/client";
import type { PhotoAsset } from "@modules/albums/types";

const PAGE_SIZE = 12;

export function InfinitePhotoGrid({ photos }: { photos: PhotoAsset[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleItems = useMemo(() => photos.slice(0, visibleCount), [photos, visibleCount]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + PAGE_SIZE, photos.length));
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [photos.length]);

  return (
    <div className="photo-grid-wrap">
      <div className="photo-grid">
        {visibleItems.map((photo) => (
          <figure className="photo-tile" key={photo.id}>
            <img alt={photo.title} loading="lazy" src={mediaUrl(photo.previewPath)} />
            <figcaption>
              <strong>{photo.title}</strong>
              {photo.description ? <span>{photo.description}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="photo-grid-sentinel" ref={sentinelRef} />
    </div>
  );
}
