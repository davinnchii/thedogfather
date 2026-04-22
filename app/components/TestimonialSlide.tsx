"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Testimonial } from "./Testimonials";

export default function TestimonialSlide({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

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
      className="testimonial-card bg-surface rounded-2xl shadow-md border border-neutral-200/70 p-5 md:p-7 flex flex-col h-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-4 min-w-0">
          {testimonial.image ? (
            <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                sizes="(min-width: 768px) 80px, 56px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-primary-15 flex items-center justify-center text-primary font-semibold text-base md:text-lg shrink-0"
              aria-hidden
            >
              {testimonial.name
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold text-on-surface truncate">
              {testimonial.name}
            </p>
            {testimonial.role ? (
              <p className="text-sm text-on-surface-tertiary truncate">
                {testimonial.role}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center shrink-0 self-start sm:self-auto">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 md:w-5 md:h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="text-on-surface-secondary leading-snug md:leading-relaxed flex-1 text-sm sm:text-base md:text-lg">
        &quot;{testimonial.content}&quot;
      </p>
    </motion.article>
  );
}

