"use client";

import { forwardRef } from "react";

type HeroIntroProps = {
  ctaText: string;
  /** Visually hidden; bra for SEO og skjermlesere */
  pageTitle: string;
  pageSubtitle: string;
};

const HeroIntro = forwardRef<HTMLHeadingElement, HeroIntroProps>(
  function HeroIntro({ ctaText, pageTitle, pageSubtitle }, ref) {
    return (
      <>
        <h1 className="sr-only">
          {pageTitle} – {pageSubtitle}
        </h1>

        <div className="max-w-xl mx-auto">
          <div className="mb-4">
            <p className="text-[0.65rem] md:text-[0.8rem] tracking-[0.35em] uppercase text-on-inverse/90 font-semibold text-center">
              Trygghet &ndash; Struktur &ndash; Relasjon
            </p>
            <div className="mt-2 h-[2px] w-20 md:w-28 bg-primary mx-auto rounded-full" />
          </div>

          <h2
            ref={ref}
            className="text-base md:text-xl lg:text-2xl text-on-inverse/90 font-medium mt-2 md:mt-4 italic text-center [text-shadow:1px_1px_4px_rgba(0,0,0,0.5)] mb-6"
          >
            &ldquo;Hos meg er hunden en del av hverdagen – ikke satt til side.
            <br />
            Små grupper, trygge rammer og personlig oppfølging.&rdquo;
          </h2>
        </div>

        <div className="mt-10 md:mt-0">
          <div className="flex flex-col items-center gap-3">
            <a
              href="#contact"
              className="relative inline-flex items-center justify-center px-8 py-3 bg-transparent border border-primary/80 rounded-full text-base md:text-lg font-semibold text-on-inverse tracking-[0.14em] uppercase hover:bg-surface-dark hover:scale-105 transition-all duration-300 shadow-[0_0_18px_rgba(0,0,0,0.6)]"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </>
    );
  },
);

export default HeroIntro;
