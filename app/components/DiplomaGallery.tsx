"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PhotoSwipe from "photoswipe";

export interface DiplomaImage {
  src: string;
  alt: string;
  title?: string;
}

interface DiplomaGalleryProps {
  images: DiplomaImage[];
  className?: string;
}

function loadImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (!src) {
      resolve({ width: 1200, height: 1600 });
      return;
    }
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1200, height: 1600 });
    img.src = src;
  });
}

export default function DiplomaGallery({
  images,
  className = "",
}: DiplomaGalleryProps) {
  const [dimensions, setDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const pswpRef = useRef<PhotoSwipe | null>(null);

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
      width: d?.width ?? 1200,
      height: d?.height ?? 1600,
      alt: img.alt,
      title: img.title ?? img.alt,
    };
  });

  const openLightbox = useCallback(
    (index: number) => {
      if (pswpItems.length === 0) return;
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
      pswpRef.current = new PhotoSwipe({
        dataSource: pswpItems,
        index,
        showHideAnimationType: "fade",
        bgOpacity: 0.95,
        spacing: 0.1,
        allowPanToNext: true,
        loop: false,
        closeTitle: "Lukk",
        zoomTitle: "Zoom",
        arrowPrevTitle: "Forrige",
        arrowNextTitle: "Neste",
        errorMsg: "Bildet kunne ikke lastes.",
      });
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
    <div className={className}>
      <p className="mb-4 text-sm text-on-surface-secondary text-center">
        Klikk på et bilde for å se det i full størrelse
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {images.map((img, index) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openLightbox(index)}
            className="group relative overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Åpne ${img.alt} i full størrelse`}
          >
            <div className="relative aspect-[3/4] w-full bg-neutral-50">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                <span className="mb-3 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
                  Se full størrelse
                </span>
              </div>
            </div>
            {img.title && (
              <p className="px-4 py-3 text-sm font-medium text-on-surface text-left border-t border-neutral-100">
                {img.title}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
