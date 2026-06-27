"use client";

import HeroVippsButton from "./HeroVippsButton";

const DESKTOP_LINK =
  "px-5 py-3.5 rounded-2xl bg-surface-dark border border-primary-700/50 text-on-inverse font-semibold shadow-lg hover:bg-surface-dark-secondary hover:border-primary-600/60 transition-all";

const MOBILE_LINK =
  "px-2 py-0.5 hover:text-white hover:underline decoration-primary/80 decoration-2 underline-offset-4 hero-mobile-nav-border-animated";

export default function HeroQuickNav() {
  return (
    <div
      className="absolute right-4 top-[calc(1.25rem+env(safe-area-inset-top,0px))] md:left-auto md:right-6 lg:right-8 md:top-28 lg:top-32 space-y-2"
      aria-label="Hurtiglenker"
    >
      <div className="hidden md:flex flex-col items-stretch gap-3 w-60 sm:w-72 lg:w-80 text-left">
        <a href="#qualifications" className={DESKTOP_LINK}>
          Om meg
        </a>
        <a href="/utdanning" className={`${DESKTOP_LINK} text-sm leading-snug`}>
          Utdanning og kompetanse
        </a>
        <a href="/vilkar" className={DESKTOP_LINK}>
          Salgsvilkår
        </a>
        <a href="#services" className={DESKTOP_LINK}>
          Tjenester & priser
        </a>
        <a href="/valpekurs" className={DESKTOP_LINK}>
          Valpekurs
        </a>
        <a href="/grunnkurs" className={DESKTOP_LINK}>
          Grunnkurs
        </a>
        <a href="#testimonials" className={DESKTOP_LINK}>
          Se anmeldelser
        </a>
        <div className="group">
          <HeroVippsButton
            size="md"
            className="w-full px-4 py-2 rounded-md bg-[#FF5B24] shadow-lg hover:bg-[#F14E1F] transition-all inline-flex items-center justify-center"
          />
          <p className="mt-1 group-hover:scale-105 group-hover:underline px-3 py-2.5 text-sm font-semibold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] group-hover:transition-all group-hover:duration-300">
            Betaling etter avtale/booking
          </p>
        </div>
      </div>

      <div className="flex md:hidden flex-col items-end gap-1.5 text-base font-bold divide-y divide-white/60 text-white/90 tracking-wide">
        <a href="#qualifications" className={MOBILE_LINK}>
          Om meg
        </a>
        <a href="/utdanning" className={`${MOBILE_LINK} text-right leading-tight`}>
          <span className="block">Utdanning og</span>
          <span className="block">kompetanse</span>
        </a>
        <a href="/vilkar" className={MOBILE_LINK}>
          Salgsvilkår
        </a>
        <a href="#services" className={MOBILE_LINK}>
          Tjenester & priser
        </a>
        <a href="/valpekurs" className={MOBILE_LINK}>
          Valpekurs
        </a>
        <a href="/grunnkurs" className={MOBILE_LINK}>
          Grunnkurs
        </a>
        <a href="#testimonials" className={MOBILE_LINK}>
          Se anmeldelser
        </a>
      </div>
    </div>
  );
}
