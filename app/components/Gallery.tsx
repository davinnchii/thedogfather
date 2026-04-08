"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import PhotoSwipe from "photoswipe";
import { Section, Container, SectionTitle } from "./ui";

interface GalleryItem {
  id: string;
  image?: string;
  video?: string;
  title: string;
  description?: string;
}

interface GalleryProps {
  title?: string;
  items: GalleryItem[];
  id?: string;
  /** Optional: limit how many main items to show on this page (e.g. home) */
  maxFeatured?: number;
  /** Optional: URL for “view more” button to full gallery page */
  showMoreHref?: string;
}

/** Load natural dimensions for an image URL (for PhotoSwipe aspect ratio) */
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

export default function Gallery({
  title = "Galleri",
  items: initialItems,
  id = "gallery",
  maxFeatured,
  showMoreHref,
}: GalleryProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const pswpRef = useRef<PhotoSwipe | null>(null);

  // Load gallery from folder via API when no items provided
  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data: { items?: GalleryItem[] }) => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, [initialItems.length]);

  // Preload image dimensions for lightbox (avoids stretched preview on desktop)
  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    const imageItems = items.filter((i): i is GalleryItem & { image: string } => Boolean(i.image));
    Promise.all(
      imageItems.map(async (item) => {
        const d = await loadImageDimensions(item.image);
        return { src: item.image, ...d };
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
  }, [items]);

  // Prepare PhotoSwipe data (use real dimensions when available)
  const buildPswpItemsFrom = useCallback(
    (sourceItems: GalleryItem[]) =>
      sourceItems
        .filter((item) => item.image || item.video)
        .map((item) => {
          if (item.video) {
            return {
              html: `
            <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #000;">
              <video style="width: 100%; height: 100%; object-fit: contain;" controls autoplay loop muted playsinline>
                <source src="${item.video}" type="video/quicktime">
                <source src="${item.video}" type="video/mp4">
              </video>
            </div>
          `,
              width: 1920,
              height: 1080,
              title: item.title,
            };
          }
          const src = item.image || "";
          const d = dimensions[src];
          return {
            src,
            width: d?.width ?? 1600,
            height: d?.height ?? 900,
            alt: item.title,
            title: item.title,
          };
        }),
    [dimensions],
  );

  const pswpItems = buildPswpItemsFrom(items);

  // Initialize PhotoSwipe
  const openPhotoSwipe = useCallback((dataSource: typeof pswpItems, index: number) => {
    if (dataSource.length === 0) return;
    const options = {
      dataSource,
      index,
      showHideAnimationType: "fade" as const,
      bgOpacity: 0.95,
      spacing: 0.1,
      allowPanToNext: true,
      loop: false,
      closeTitle: "Lukk",
      zoomTitle: "Zoom",
      arrowPrevTitle: "Forrige",
      arrowNextTitle: "Neste",
      errorMsg: "Bildet kunne ikke lastes.",
      className: "object-cover",
    };
    if (pswpRef.current) {
      pswpRef.current.destroy();
    }
    pswpRef.current = new PhotoSwipe(options);
    pswpRef.current.init();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
    };
  }, []);

  // Autoplay videos on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.play().catch(() => {
            // Handle autoplay restrictions
          });
        }
      });
    }
  }, [items]);

  const handleMouseEnter = useCallback((itemId: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const video = videoRefs.current[itemId];
      if (video) video.play().catch(() => { });
    }
  }, []);

  const handleMouseLeave = useCallback((itemId: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const video = videoRefs.current[itemId];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, []  );

  // Home: show only a curated subset; rest are on /gallery (no teaser row)
  const hasLimit = typeof maxFeatured === "number" && maxFeatured > 0;
  let featuredItems: GalleryItem[];

  if (hasLimit && id === "gallery") {
    // Explicit order for forsiden: 5 bilder + 1 video
    const curatedOrder = [
      "/gallery/9.jpeg",
      "/gallery/15.jpg",
      "/gallery/12.jpg",
      "/gallery/gallery_video3.MOV",
      "/gallery/16.jpg",
      "/gallery/14.jpg",
      "/gallery/Snapchat-227583058.mp4",
    ];

    const selected: GalleryItem[] = [];

    for (const path of curatedOrder) {
      const item = items.find(
        (i) => i.image === path || i.video === path,
      );
      if (item && !selected.includes(item)) {
        selected.push(item);
      }
    }

    // Fallback: fill remaining slots (if any) in original order
    if (selected.length < maxFeatured) {
      for (const item of items) {
        if (selected.includes(item)) continue;
        selected.push(item);
        if (selected.length >= maxFeatured) break;
      }
    }

    featuredItems = selected;
  } else if (hasLimit) {
    featuredItems = items.slice(0, maxFeatured);
  } else {
    featuredItems = items;
  }

  const moreCount =
    hasLimit && showMoreHref ? Math.max(items.length - featuredItems.length, 0) : 0;
  const showMoreCard = moreCount > 0 && Boolean(showMoreHref);

  // On main page, lightbox shows only featured items; on /gallery, full gallery
  const lightboxPswpItems =
    hasLimit && showMoreHref ? buildPswpItemsFrom(featuredItems) : pswpItems;

  const handleItemClick = useCallback(
    (item: GalleryItem) => {
      if (
        item.video &&
        typeof window !== "undefined" &&
        window.innerWidth < 768
      ) {
        return;
      }
      const mediaItems =
        hasLimit && showMoreHref
          ? featuredItems.filter((i) => i.image || i.video)
          : items.filter((i) => i.image || i.video);
      const indexInLightbox = mediaItems.findIndex((i) => i.id === item.id);
      if (indexInLightbox >= 0) {
        openPhotoSwipe(lightboxPswpItems, indexInLightbox);
      }
    },
    [items, featuredItems, hasLimit, showMoreHref, lightboxPswpItems, openPhotoSwipe],
  );

  const liftClass =
    "rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300";

  const renderCard = (item: GalleryItem, index: number) => {
    const hasMedia = item.image || item.video;
    const isFirstImage = index === 0 && item.image;
    return (
      <div
        key={item.id}
        className={`relative overflow-hidden group cursor-pointer aspect-square ${liftClass}`}
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={() => handleMouseLeave(item.id)}
        onClick={() => hasMedia && handleItemClick(item)}
      >
        <div className="relative w-full h-full flex items-center justify-center bg-neutral-100 overflow-hidden rounded-[inherit]">
          {item.video ? (
            <video
              ref={(el) => {
                videoRefs.current[item.id] = el;
              }}
              src={item.video}
              loop
              muted
              playsInline
              preload="auto"
              className="max-w-full max-h-full w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
              loading={isFirstImage ? "eager" : "lazy"}
            />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <Section id={id} className="py-20 px-4 bg-surface">
      <Container>
        <SectionTitle className="mb-12">{title}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredItems.map((item, index) => renderCard(item, index))}

          {/* "More" card when there are additional images on /gallery */}
          {showMoreCard && (
            <a
              href={showMoreHref}
              className={`group relative flex overflow-hidden aspect-square ${liftClass}`}
              aria-label={`Se ${moreCount} flere bilder i galleriet`}
            >
              <div className="absolute inset-0 bg-neutral-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/20 transition-colors group-hover:bg-primary/30">
                <span className="text-lg font-semibold text-on-surface md:text-xl">
                  +{moreCount} flere
                </span>
                <span className="text-sm font-medium text-on-surface/80 group-hover:text-on-surface">
                  Se hele galleriet →
                </span>
              </div>
            </a>
          )}
        </div>
      </Container>
    </Section>
  );
}
