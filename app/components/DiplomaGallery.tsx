"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PhotoSwipe from "photoswipe";

export interface DiplomaImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  /** Degrees to rotate for correct display (e.g. -90 when EXIF/pixels disagree with Finder). */
  rotation?: -90 | 90;
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
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    };
    img.onerror = () => resolve({ width: 3434, height: 2416 });
    img.src = src;
  });
}

function isQuarterTurn(rotation?: number): rotation is -90 | 90 {
  return rotation === -90 || rotation === 90;
}

function displayDimensions(
  width: number,
  height: number,
  rotation?: -90 | 90
) {
  if (isQuarterTurn(rotation)) {
    return { width: height, height: width };
  }
  return { width, height };
}

function lightboxCacheKey(img: DiplomaImage) {
  return `${img.src}:${img.rotation ?? 0}`;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function createRotatedImageUrl(
  src: string,
  rotation: -90 | 90
): Promise<string> {
  const img = await loadImageElement(src);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const canvas = document.createElement("canvas");

  canvas.width = height;
  canvas.height = width;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not supported");
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(img, -width / 2, -height / 2, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Failed to rotate image")),
      "image/jpeg",
      0.92
    );
  });

  return URL.createObjectURL(blob);
}

async function resolveLightboxSrc(
  img: DiplomaImage,
  cache: Record<string, string>
): Promise<string> {
  if (!isQuarterTurn(img.rotation)) {
    return img.src;
  }

  const key = lightboxCacheKey(img);
  if (cache[key]) {
    return cache[key];
  }

  return createRotatedImageUrl(img.src, img.rotation);
}

interface DiplomaImageFrameProps {
  src: string;
  alt: string;
  viewWidth: number;
  viewHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  rotation?: -90 | 90;
  useRotatedSource: boolean;
}

function DiplomaImageFrame({
  src,
  alt,
  viewWidth,
  viewHeight,
  sourceWidth,
  sourceHeight,
  rotation,
  useRotatedSource,
}: DiplomaImageFrameProps) {
  if (useRotatedSource || !isQuarterTurn(rotation)) {
    return (
      <div
        className="relative w-full overflow-hidden bg-neutral-50"
        style={{ aspectRatio: `${viewWidth} / ${viewHeight}` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 42rem"
          unoptimized
          className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-50"
      style={{ aspectRatio: `${viewWidth} / ${viewHeight}` }}
    >
      <Image
        src={src}
        alt={alt}
        width={sourceWidth}
        height={sourceHeight}
        sizes="(max-width: 768px) 100vw, 42rem"
        unoptimized
        className="absolute left-1/2 top-1/2 max-w-none max-h-none object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
        style={{
          height: "100%",
          width: "auto",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
      />
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
  const [lightboxSrcByKey, setLightboxSrcByKey] = useState<
    Record<string, string>
  >({});
  const pswpRef = useRef<PhotoSwipe | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

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

  useEffect(() => {
    if (images.length === 0) return;

    let cancelled = false;

    const revokeBlobUrls = () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };

    async function prepareLightboxSources() {
      revokeBlobUrls();

      const entries = await Promise.all(
        images.map(async (img) => {
          const key = lightboxCacheKey(img);
          if (!isQuarterTurn(img.rotation)) {
            return [key, img.src] as const;
          }

          const url = await createRotatedImageUrl(img.src, img.rotation);
          return [key, url] as const;
        })
      );

      if (cancelled) {
        entries.forEach(([, url]) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
        return;
      }

      blobUrlsRef.current = entries
        .map(([, url]) => url)
        .filter((url) => !images.some((img) => img.src === url));

      setLightboxSrcByKey(Object.fromEntries(entries));
    }

    prepareLightboxSources().catch(() => {
      if (!cancelled) setLightboxSrcByKey({});
    });

    return () => {
      cancelled = true;
      revokeBlobUrls();
    };
  }, [images]);

  const buildPswpItems = useCallback(
    async (cache: Record<string, string>) => {
      return Promise.all(
        images.map(async (img) => {
          const d = dimensions[img.src];
          const width = d?.width ?? 3434;
          const height = d?.height ?? 2416;
          const view = displayDimensions(width, height, img.rotation);
          const src = await resolveLightboxSrc(img, cache);

          return {
            src,
            width: view.width,
            height: view.height,
            alt: img.alt,
            title: img.title ?? img.alt,
          };
        })
      );
    },
    [images, dimensions]
  );

  const openLightbox = useCallback(
    async (index: number) => {
      if (images.length === 0) return;

      const pswpItems = await buildPswpItems(lightboxSrcByKey);

      const nextCache = { ...lightboxSrcByKey };
      let cacheUpdated = false;

      images.forEach((img, itemIndex) => {
        const item = pswpItems[itemIndex];
        if (
          item.src.startsWith("blob:") &&
          !blobUrlsRef.current.includes(item.src)
        ) {
          blobUrlsRef.current.push(item.src);
        }

        if (isQuarterTurn(img.rotation)) {
          const key = lightboxCacheKey(img);
          if (nextCache[key] !== item.src) {
            nextCache[key] = item.src;
            cacheUpdated = true;
          }
        }
      });

      if (cacheUpdated) {
        setLightboxSrcByKey(nextCache);
      }

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
        padding: { top: 24, bottom: 24, left: 16, right: 16 },
        closeTitle: "Lukk",
        zoomTitle: "Zoom",
        arrowPrevTitle: "Forrige",
        arrowNextTitle: "Neste",
        errorMsg: "Bildet kunne ikke lastes.",
      });
      pswpRef.current.init();
    },
    [buildPswpItems, images, lightboxSrcByKey]
  );

  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, []);

  if (images.length === 0) return null;

  return (
    <div className={className}>
      <p className="mb-4 text-sm text-on-surface-secondary text-center">
        Klikk på et bilde for å se det i full størrelse
      </p>
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 md:gap-6">
        {images.map((img, index) => {
          const d = dimensions[img.src];
          const sourceWidth = d?.width ?? 3434;
          const sourceHeight = d?.height ?? 2416;
          const view = displayDimensions(
            sourceWidth,
            sourceHeight,
            img.rotation
          );
          const cacheKey = lightboxCacheKey(img);
          const rotatedSrc = lightboxSrcByKey[cacheKey];
          const useRotatedSource = Boolean(
            isQuarterTurn(img.rotation) &&
              rotatedSrc &&
              rotatedSrc.startsWith("blob:")
          );
          const displaySrc = useRotatedSource ? rotatedSrc : img.src;

          return (
            <button
              key={img.src}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200/70 bg-white text-left shadow-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Åpne ${img.alt} i full størrelse`}
            >
              <div className="relative w-full">
                <DiplomaImageFrame
                  src={displaySrc}
                  alt={img.alt}
                  viewWidth={view.width}
                  viewHeight={view.height}
                  sourceWidth={sourceWidth}
                  sourceHeight={sourceHeight}
                  rotation={img.rotation}
                  useRotatedSource={useRotatedSource}
                />
                <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                  <span className="mb-3 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
                    Se full størrelse
                  </span>
                </div>
              </div>
              {(img.title || img.description) && (
                <div className="px-4 py-3 text-left border-t border-neutral-100 space-y-1">
                  {img.title && (
                    <p className="text-sm font-semibold text-on-surface">
                      {img.title}
                    </p>
                  )}
                  {img.description && (
                    <p className="text-sm text-on-surface-secondary leading-relaxed">
                      {img.description}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
