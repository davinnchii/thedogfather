"use client";

/**
 * Modern responsive horizontal image gallery (Airbnb/marketplace style).
 * - Horizontal flex layout with 6 (lg) / 4 (md) / 2–3 (sm) fully visible images and partial preview of next.
 * - "+N more" overlay on first partially visible image; click opens PhotoSwipe lightbox.
 * - Smooth horizontal scroll, hidden scrollbar, right-edge gradient fade.
 * - Uses existing PhotoSwipe for modal (ESC, click outside, arrows, keyboard).
 *
 * @example
 * const images = [
 *   { src: "/gallery/1.jpg", alt: "Description", title: "Caption" },
 *   ...
 * ];
 * <ListingGallery images={images} id="gallery" className="max-w-6xl mx-auto px-4" />
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import PhotoSwipe from "photoswipe";

export interface ListingGalleryImage {
  src: string;
  alt?: string;
  title?: string;
}

interface ListingGalleryProps {
  /** Array of image URLs (and optional alt/title). */
  images: ListingGalleryImage[];
  /** Optional section id for anchor links. */
  id?: string;
  /** Optional class for the outer wrapper. */
  className?: string;
}

/** Load natural dimensions for an image URL (for PhotoSwipe aspect ratio). */
function loadImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (!src) {
      resolve({ width: 1600, height: 900 });
      return;
    }
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1600, height: 900 });
    img.src = src;
  });
}

export default function ListingGallery({
  images,
  id,
  className = "",
}: ListingGalleryProps) {
  const [dimensions, setDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const pswpRef = useRef<PhotoSwipe | null>(null);

  // Preload image dimensions for PhotoSwipe lightbox
  useEffect(() => {
    if (images.length === 0) return;
    let cancelled = false;
    Promise.all(
      images.map(async (img) => {
        const d = await loadImageDimensions(img.src);
        return { src: img.src, ...d };
      })
    ).then((results) => {
      if (cancelled) return;
      setDimensions(
        results.reduce(
          (acc, { src, width, height }) => {
            acc[src] = { width, height };
            return acc;
          },
          {} as Record<string, { width: number; height: number }>
        )
      );
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  const pswpItems = images.map((img) => {
    const d = dimensions[img.src];
    return {
      src: img.src,
      width: d?.width ?? 1600,
      height: d?.height ?? 900,
      alt: img.alt ?? img.title ?? "Bilde",
      title: img.title ?? img.alt ?? "",
    };
  });

  const openLightbox = useCallback(
    (index: number) => {
      if (pswpItems.length === 0) return;
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
      const options = {
        dataSource: pswpItems,
        index,
        showHideAnimationType: "fade" as const,
        bgOpacity: 0.95,
        spacing: 0.1,
        allowPanToNext: true,
        loop: true,
        closeTitle: "Lukk",
        zoomTitle: "Zoom",
        arrowPrevTitle: "Forrige",
        arrowNextTitle: "Neste",
        errorMsg: "Bildet kunne ikke lastes.",
      };
      pswpRef.current = new PhotoSwipe(options);
      pswpRef.current.init();
    },
    [pswpItems]
  );

  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
    };
  }, []);

  if (images.length === 0) return null;

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${className}`}
      aria-label="Bildegalleri"
    >
      {/* Horizontal scroll container: smooth scroll, hidden scrollbar */}
      <div
        className="flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {images.map((img, index) => {
          const moreCount =
            index === 6
              ? images.length - 6
              : index === 4
                ? images.length - 4
                : index === 3
                  ? images.length - 3
                  : index === 2
                    ? images.length - 2
                    : 0;
          const showOverlayLg = index === 6 && images.length > 6;
          const showOverlayMd = index === 4 && images.length > 4;
          const showOverlaySm = index === 3 && images.length > 3;
          const showOverlayBase = index === 2 && images.length > 2;

          return (
            <div
              key={`${img.src}-${index}`}
              className="listing-gallery-item relative shrink-0 overflow-hidden rounded-lg bg-neutral-200 shadow-md transition-transform duration-300 hover:shadow-lg group min-w-[calc((100%-0.5rem)/2)] sm:min-w-[calc((100%-1rem)/3)] md:min-w-[calc((100%-1.5rem)/4)] lg:min-w-[calc((100%-2.5rem)/6)]"
            >
              <div className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={img.src}
                  alt={img.alt ?? img.title ?? `Bilde ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.666vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openLightbox(index)}
                />

                {/* See more overlay: first partially visible image per breakpoint */}
                {showOverlayBase && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                    className="listing-gallery-overlay absolute inset-0 flex items-center justify-center bg-black/50 transition-all duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:hidden"
                    aria-label={`Se ${moreCount} flere bilder`}
                  >
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105">
                      +{moreCount} more
                    </span>
                  </button>
                )}
                {showOverlaySm && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                    className="listing-gallery-overlay absolute inset-0 hidden items-center justify-center bg-black/50 transition-all duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:flex md:hidden"
                    aria-label={`Se ${moreCount} flere bilder`}
                  >
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105">
                      +{moreCount} more
                    </span>
                  </button>
                )}
                {showOverlayMd && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                    className="listing-gallery-overlay absolute inset-0 hidden items-center justify-center bg-black/50 transition-all duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:flex lg:hidden"
                    aria-label={`Se ${moreCount} flere bilder`}
                  >
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105">
                      +{moreCount} more
                    </span>
                  </button>
                )}
                {showOverlayLg && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                    className="listing-gallery-overlay absolute inset-0 hidden items-center justify-center bg-black/50 transition-all duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:flex"
                    aria-label={`Se ${moreCount} flere bilder`}
                  >
                    <span className="rounded-lg bg-black/60 px-4 py-2 text-base font-semibold text-white transition-transform duration-200 hover:scale-105">
                      +{moreCount} more
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right-side gradient fade to hint more content */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-20 shrink-0 bg-linear-to-l from-background to-transparent md:w-24"
        aria-hidden
      />
    </section>
  );
}
