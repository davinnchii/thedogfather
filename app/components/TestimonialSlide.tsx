"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import PhotoSwipe from "photoswipe";
import type { Testimonial } from "./Testimonials";

function loadImageDimensions(
  src: string,
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

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary-15 flex items-center justify-center text-primary font-semibold text-base md:text-lg shrink-0"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} av 5 stjerner`}>
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 md:w-6 md:h-6 text-primary"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSlide({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const photos = (testimonial.photos?.filter(Boolean) ?? []).slice(0, 2);
  const photosKey = photos.join("|");
  const hasOnePhoto = photos.length === 1;
  const hasTwoPhotos = photos.length === 2;
  const [dimensions, setDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const pswpRef = useRef<PhotoSwipe | null>(null);

  useEffect(() => {
    if (photos.length === 0) return;
    let cancelled = false;
    Promise.all(
      photos.map(async (src) => {
        const d = await loadImageDimensions(src);
        return { src, ...d };
      }),
    ).then((results) => {
      if (cancelled) return;
      setDimensions(
        results.reduce(
          (acc, { src, width, height }) => {
            acc[src] = { width, height };
            return acc;
          },
          {} as Record<string, { width: number; height: number }>,
        ),
      );
    });
    return () => {
      cancelled = true;
    };
    // photosKey is the stable identity for this photo set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosKey]);

  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
    };
  }, []);

  const openLightbox = useCallback(
    (photoIndex: number) => {
      if (photos.length === 0) return;

      const dataSource = photos.map((src) => {
        const d = dimensions[src];
        return {
          src,
          width: d?.width ?? 1600,
          height: d?.height ?? 900,
          alt: `Bilde fra anmeldelse av ${testimonial.name}`,
        };
      });

      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }

      pswpRef.current = new PhotoSwipe({
        dataSource,
        index: photoIndex,
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
    [photos, dimensions, testimonial.name],
  );

  return (
    <motion.article
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.35,
        delay: shouldReduceMotion ? 0 : index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="testimonial-card bg-surface rounded-2xl md:rounded-3xl shadow-md border border-neutral-200/70 overflow-hidden flex flex-col w-full h-full"
    >
      <div className="flex flex-col gap-4 md:gap-5 p-5 sm:p-6 md:p-8 lg:p-10 h-full min-h-0">
        {/* Avatar | Name */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0 shrink-0">
          {testimonial.image ? (
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <Initials name={testimonial.name} />
          )}
          <p className="font-semibold text-on-surface text-lg md:text-xl lg:text-2xl truncate">
            {testimonial.name}
          </p>
        </div>

        {/* Stars - date */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0">
          <Stars rating={testimonial.rating} />
          {testimonial.role ? (
            <>
              <span className="text-on-surface-tertiary" aria-hidden>
                –
              </span>
              <p className="text-sm md:text-base text-on-surface-tertiary">
                {testimonial.role}
              </p>
            </>
          ) : null}
        </div>

        {/* Full quote — natural height, never truncated */}
        <p className="text-on-surface-secondary leading-relaxed text-base sm:text-lg md:text-xl shrink-0">
          &quot;{testimonial.content}&quot;
        </p>

        {/* Photos fill leftover card height */}
        {photos.length > 0 ? (
          <div
            className={[
              "flex-1 min-h-[160px] sm:min-h-[180px] md:min-h-[200px]",
              hasTwoPhotos ? "grid grid-cols-2 gap-2 md:gap-3" : "flex",
            ].join(" ")}
          >
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(i);
                }}
                className="group relative h-full w-full overflow-hidden rounded-xl bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Åpne bilde ${i + 1} fra anmeldelse av ${testimonial.name}`}
              >
                <Image
                  src={src}
                  alt={
                    i === 0
                      ? `Bilde fra anmeldelse av ${testimonial.name}`
                      : ""
                  }
                  fill
                  sizes={
                    hasOnePhoto
                      ? "(min-width: 1024px) 56rem, 100vw"
                      : "(min-width: 1024px) 28rem, 50vw"
                  }
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="mb-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white md:text-sm">
                    Se full størrelse
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
