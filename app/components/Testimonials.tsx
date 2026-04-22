"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { Section, Container, SectionTitle } from "./ui";
import TestimonialSlide from "./TestimonialSlide";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
}

interface TestimonialsProps {
  title?: string;
  /** Fallback testimonials when API returns none or fails */
  testimonials?: Testimonial[];
  id?: string;
  /** Google Business/Maps URL where users can see all reviews */
  googleMapsReviewUrl?: string;
}

export default function Testimonials({
  title = "Hva sier kunder?",
  testimonials: fallbackTestimonials = [],
  id = "testimonials",
  googleMapsReviewUrl,
}: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | undefined>(undefined);
  const sliderShellRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFixedHeight, setMobileFixedHeight] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: { testimonials?: Testimonial[]; error?: string }) => {
        if (cancelled) return;
        const list = data.testimonials?.length ? data.testimonials : fallbackTestimonials;
        setTestimonials(list);
      })
      .catch(() => {
        if (!cancelled) setTestimonials(fallbackTestimonials);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fallbackTestimonials]);

  useEffect(() => {
    if (!isMobile) return;

    const measure = () => {
      const root = sliderShellRef.current;
      if (!root) return;

      const cards = Array.from(
        root.querySelectorAll<HTMLElement>(".testimonials-swiper-mobile .testimonial-card")
      );
      if (cards.length === 0) return;

      const maxHeight = cards.reduce((max, el) => Math.max(max, el.offsetHeight), 0);
      if (maxHeight > 0) {
        setMobileFixedHeight(maxHeight);
      }
    };

    const timeoutId = window.setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", measure);
    };
  }, [isMobile, testimonials]);

  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex === testimonials.length - 1;

  return (
    <Section
      id={id}
      className="relative py-14 md:py-16 px-4 overflow-hidden bg-surface-secondary"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 45%)`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-200/60 to-transparent" />

      <Container size="5xl" className="relative">
        <SectionTitle eyebrow="Anmeldelser" divider className="mb-8">
          {title}
        </SectionTitle>

        {loading ? (
          <div className="flex justify-center py-12">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
              aria-hidden
            />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-muted text-center py-8">
            Ingen anmeldelser å vise ennå.
          </p>
        ) : (
          <div ref={sliderShellRef} className="relative overflow-x-hidden md:overflow-visible">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="custom-swiper-button custom-swiper-button-prev testimonials-nav-desktop"
              aria-label="Forrige anmeldelse"
              disabled={isAtStart}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <Swiper
              modules={isMobile ? [Pagination, Autoplay] : [Pagination, Autoplay, EffectCoverflow]}
              direction="horizontal"
              autoHeight={false}
              centeredSlides={!isMobile}
              slideToClickedSlide={!isMobile}
              effect={isMobile ? "slide" : "coverflow"}
              grabCursor={!isMobile}
              {...(!isMobile
                ? {
                    coverflowEffect: {
                      rotate: 35,
                      stretch: 0,
                      depth: 140,
                      modifier: 1,
                      slideShadows: false,
                    },
                  }
                : {})}
              spaceBetween={isMobile ? 14 : 20}
              slidesPerView={isMobile ? 1 : 1.15}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 6500,
                disableOnInteraction: false,
              }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.activeIndex);
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              breakpoints={{
                640: { slidesPerView: 1.3, spaceBetween: 22 },
                768: { slidesPerView: 2.2, spaceBetween: 26 },
                1024: { slidesPerView: 3, spaceBetween: 44 },
                1280: { slidesPerView: 3, spaceBetween: 56 },
              }}

              className={
                isMobile
                  ? "testimonials-swiper-compact testimonials-swiper-mobile"
                  : "testimonials-swiper-compact testimonials-swiper-coverflow"
              }
              style={isMobile && mobileFixedHeight ? { height: `${mobileFixedHeight}px` } : undefined}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id}>
                  <TestimonialSlide testimonial={testimonial} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="custom-swiper-button custom-swiper-button-next testimonials-nav-desktop"
              aria-label="Neste anmeldelse"
              disabled={isAtEnd}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="testimonials-mobile-controls">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="testimonials-mobile-nav-btn"
                aria-label="Forrige anmeldelse"
                disabled={isAtStart}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="testimonials-mobile-nav-btn"
                aria-label="Neste anmeldelse"
                disabled={isAtEnd}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {googleMapsReviewUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={googleMapsReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Se alle anmeldelser på Google
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5h5m0 0v5m0-5L10 14"
                />
              </svg>
            </a>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
