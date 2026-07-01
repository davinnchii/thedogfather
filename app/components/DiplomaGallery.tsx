"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PhotoSwipe from "photoswipe";

export interface DiplomaImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
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
      resolve({ width: 3434, height: 2416 });
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => resolve({ width: 3434, height: 2416 });
    img.src = src;
  });
}

interface DiplomaImageFrameProps {
  src: string;
  alt: string;
}

function DiplomaImageFrame({ src, alt }: DiplomaImageFrameProps) {
  return (
    <div className="diploma-picture-frame">
      <div className="diploma-picture-mat">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="diploma-picture-img mx-auto h-auto w-auto max-h-56 max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] sm:max-h-64 md:max-h-72"
        />
      </div>
    </div>
  );
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

  const buildPswpItems = useCallback(() => {
    return images.map((img) => {
      const d = dimensions[img.src];
      const width = d?.width ?? 3434;
      const height = d?.height ?? 2416;

      return {
        src: img.src,
        width,
        height,
        alt: img.alt,
        title: img.title ?? img.alt,
      };
    });
  }, [images, dimensions]);

  const openLightbox = useCallback(
    (index: number) => {
      if (images.length === 0) return;

      const pswpItems = buildPswpItems();
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
        allowPanToNext: false,
        loop: false,
        paddingFn: (viewportSize) => ({
          top: 48,
          bottom: 48,
          left: Math.max(48, viewportSize.x * 0.08),
          right: Math.max(48, viewportSize.x * 0.08),
        }),
        closeTitle: "Lukk",
        zoomTitle: "Zoom",
        arrowPrevTitle: "Forrige",
        arrowNextTitle: "Neste",
        errorMsg: "Bildet kunne ikke lastes.",
      });
      pswpRef.current.init();
    },
    [buildPswpItems, images.length]
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
    <div className={`diploma-gallery ${className}`.trim()}>
      <p className="mb-4 text-center text-sm text-on-surface-secondary">
        Klikk på et bilde for å se det i full størrelse
      </p>
      <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-4 md:gap-6">
        {images.map((img, index) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openLightbox(index)}
            className="group mx-auto w-full text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Åpne ${img.alt} i full størrelse`}
          >
            <div className="relative w-full">
              <DiplomaImageFrame src={img.src} alt={img.alt} />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="mb-3 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
                  Se full størrelse
                </span>
              </div>
            </div>
            {(img.title || img.description) && (
              <div className="mt-3 space-y-1 px-1 text-left">
                {img.title && (
                  <p className="text-sm font-semibold text-on-surface">
                    {img.title}
                  </p>
                )}
                {img.description && (
                  <p className="text-sm leading-relaxed text-on-surface-secondary">
                    {img.description}
                  </p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
