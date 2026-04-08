"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SHAKE_INTERVAL_MS = 3000;

interface TestimonialsCTAProps {
  googleMapsReviewUrl?: string;
  /** Optional custom title (default: "Hvordan var opplevelsen?") */
  title?: string;
  /** Optional custom description */
  description?: string;
}

export default function TestimonialsCTA({
  googleMapsReviewUrl,
  title = "Hvordan var opplevelsen?",
  description = "Del gjerne din opplevelse på Google – tilbakemeldinger gjør det lettere for andre eiere å velge riktig hundepass.",
}: TestimonialsCTAProps) {
  const shouldReduceMotion = useReducedMotion();
  const [shakeKey, setShakeKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;
    const t = setInterval(() => setShakeKey((k) => k + 1), SHAKE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [shouldReduceMotion, isHovered]);

  if (!googleMapsReviewUrl) return null;

  return (
    <section className="py-16 px-4 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-primary-300 bg-primary-15/60 px-6 py-8 md:px-10 md:py-10 shadow-[0_18px_45px_rgba(0,0,0,0.08)] text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted text-base md:text-lg mb-6 max-w-2xl mx-auto">
            {description}
          </p>
          <motion.a
          key={shakeKey}
          href={googleMapsReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={shouldReduceMotion ? false : { x: 0 }}
          animate={
            isHovered
              ? false
              : shouldReduceMotion
                ? {}
                : {
                    rotateX: [0, 18, -18, 18, -18, 9, -9, 0],
                    rotateY: [0, 18, -18, 18, -18, 9, -9, 0],
                    rotateZ: [0, 18, -18, 18, -18, 9, -9, 0],
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                    },
                    scale: [1, 1.15, 1],
                  }
          }
          className="inline-flex items-center gap-3 px-6 py-3.5 text-base font-semibold text-white bg-primary rounded-full shadow-lg hover:bg-primary-hover hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
            <svg
              className="w-6 h-6 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Skriv en anmeldelse på Google
          </motion.a>
        </div>
      </div>
    </section>
  );
}

