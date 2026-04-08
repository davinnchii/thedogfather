"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Section, Container, SectionTitle } from "./ui";

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
}

export default function Testimonials({
  title = "Hva sier kunder?",
  testimonials: fallbackTestimonials = [],
  id = "testimonials",
}: TestimonialsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: shouldReduceMotion ? 0.15 : 0.35,
                  delay: shouldReduceMotion ? 0 : index * 0.06,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="bg-surface rounded-xl shadow-md border border-neutral-200/70 p-5 md:p-6 flex flex-col h-full"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-on-surface-secondary leading-relaxed mb-4 flex-1 text-base">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="pt-4 border-t border-neutral-200 flex items-center gap-3">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover bg-neutral-200/60 shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-primary-15 flex items-center justify-center text-primary font-semibold text-sm shrink-0"
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
                  <p className="font-semibold text-on-surface truncate">
                    {testimonial.name}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
