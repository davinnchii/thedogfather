"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Section, Container, SectionTitle } from "./ui";
import TestimonialSlide from "./TestimonialSlide";
import "swiper/css";
import "swiper/css/pagination";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  /** Author avatar */
  image?: string;
  /** Photos from the review (first two shown) */
  photos?: string[];
}

interface TestimonialsProps {
  title?: string;
  testimonials?: Testimonial[];
  id?: string;
  /** Google Business/Maps URL where users can see all reviews */
  googleMapsReviewUrl?: string;
}

export default function Testimonials({
  title = "Hva sier kunder?",
  testimonials = [],
  id = "testimonials",
  googleMapsReviewUrl,
}: TestimonialsProps) {
  const swiperRef = useRef<SwiperType | undefined>(undefined);
  const sliderShellRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Lock swiper height to the tallest card so slides don't jump
  useEffect(() => {
    const measure = () => {
      const root = sliderShellRef.current;
      if (!root) return;

      const swiperEl = root.querySelector<HTMLElement>(".testimonials-swiper-single");
      const cards = Array.from(
        root.querySelectorAll<HTMLElement>(".testimonial-card"),
      );
      const slides = Array.from(
        root.querySelectorAll<HTMLElement>(".swiper-slide"),
      );
      if (cards.length === 0) return;

      // Temporarily unlock heights to measure natural content size
      const prevSwiperHeight = swiperEl?.style.height ?? "";
      if (swiperEl) swiperEl.style.height = "auto";
      slides.forEach((el) => {
        el.style.height = "auto";
      });
      cards.forEach((el) => {
        el.style.height = "auto";
      });

      const maxHeight = cards.reduce(
        (max, el) => Math.max(max, el.getBoundingClientRect().height),
        0,
      );

      if (swiperEl) swiperEl.style.height = prevSwiperHeight;
      slides.forEach((el) => {
        el.style.height = "";
      });
      cards.forEach((el) => {
        el.style.height = "";
      });

      if (maxHeight > 0) {
        const mobile = window.matchMedia("(max-width: 640px)").matches;
        const capped = mobile
          ? Math.min(maxHeight, Math.round(window.innerHeight * 0.75))
          : maxHeight;
        setFixedHeight(Math.ceil(capped));
      }
    };

    // Measure after layout, then again after images settle
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [testimonials, isMobile]);

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

        {testimonials.length === 0 ? (
          <p className="text-muted text-center py-8">
            Ingen anmeldelser å vise ennå.
          </p>
        ) : (
          <div
            ref={sliderShellRef}
            className="relative overflow-x-hidden md:overflow-visible w-full"
          >
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
              modules={[Pagination, Autoplay]}
              direction="horizontal"
              autoHeight={false}
              slidesPerView={1}
              spaceBetween={16}
              grabCursor
              pagination={{ clickable: true }}
              autoplay={{
                delay: 7000,
                disableOnInteraction: false,
              }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.activeIndex);
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              className={
                isMobile
                  ? "testimonials-swiper-compact testimonials-swiper-mobile testimonials-swiper-single"
                  : "testimonials-swiper-compact testimonials-swiper-single"
              }
              style={fixedHeight ? { height: `${fixedHeight}px` } : undefined}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id} style={{ height: "100%" }}>
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
