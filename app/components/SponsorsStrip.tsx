"use client";

import Image from "next/image";
import Link from "next/link";

export type SponsorItem = {
  src: string;
  alt: string;
  /** Ekstern URL (https://…) eller intern sti (f.eks. /partner/petxl) */
  href?: string;
};

interface SponsorsStripProps {
  sponsors: SponsorItem[];
  /** overlay: on hero image (desktop). surface: light strip between sections (mobile). */
  variant: "overlay" | "surface";
  className?: string;
}

export default function SponsorsStrip({
  sponsors,
  variant,
  className = "",
}: SponsorsStripProps) {
  if (sponsors.length === 0) return null;

  const logoWrap =
    variant === "overlay"
      ? "relative h-8 w-20 sm:h-10 lg:h-11 sm:w-40 lg:w-44 opacity-95"
      : "relative h-7 w-20 sm:h-9 sm:w-40 opacity-95";

  const sizes =
    variant === "overlay"
      ? "(max-width: 640px) 80px, (max-width: 1024px) 176px, 208px"
      : "(max-width: 640px) 80px, 176px";

  const SponsorCell = ({ s }: { s: SponsorItem }) => {
    const img = (
      <Image
        src={s.src}
        alt={s.alt}
        fill
        sizes={sizes}
        className="object-contain"
      />
    );
    const label = s.alt ? `Besøk ${s.alt}` : "Partnerlenke";
    const shell = `${logoWrap} relative block transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`;

    if (!s.href) {
      return <div className={logoWrap}>{img}</div>;
    }

    if (s.href.startsWith("/")) {
      return (
        <Link href={s.href} className={shell} aria-label={label}>
          {img}
        </Link>
      );
    }

    return (
      <a
        href={s.href}
        className={shell}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {img}
      </a>
    );
  };

  const desktopLogos = (
    <div
      className={
        variant === "overlay"
          ? "hidden sm:flex items-center justify-center gap-10 lg:gap-12 flex-wrap"
          : `hidden sm:flex mx-auto w-full max-w-7xl items-center justify-center gap-8 flex-wrap px-4 py-4 ${className}`
      }
    >
      {sponsors.map((s) => (
        <SponsorCell key={s.src} s={s} />
      ))}
    </div>
  );

  const mobileMarquee = (
    <div
      className={
        variant === "overlay"
          ? "sm:hidden"
          : `sm:hidden mx-auto w-full max-w-7xl px-3 py-3 ${className}`
      }
    >
      <div className="sponsors-marquee-mask">
        <div
          className={`sponsors-marquee-track ${
            sponsors.length > 1 ? "sponsors-marquee-track-animated" : ""
          }`}
        >
          {[...sponsors, ...sponsors].map((s, index) => (
            <div key={`mobile-${s.src}-${index}`} className="sponsors-marquee-item">
              <SponsorCell s={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (variant === "surface") {
    return (
      <>
        {mobileMarquee}
        {desktopLogos}
      </>
    );
  }

  /* Desktop hero: title + logos */
  return (
    <div
      className={`w-full border bg-surface-secondary border-white/15 px-6 pb-3 pt-1.5 shadow-lg shadow-black/30 ${className}`}
    >
      <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-on-surface-secondary mb-2">
        Samarbeidspartnere
      </p>
      {mobileMarquee}
      {desktopLogos}
    </div>
  );
}
