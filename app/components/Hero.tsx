"use client";

import { useRef } from "react";
import HeroImage from "./HeroImage";
import SponsorsStrip from "./SponsorsStrip";
import HeroQuickNav from "./hero/HeroQuickNav";
import HeroMobileVippsBar from "./hero/HeroMobileVippsBar";
import HeroIntro from "./hero/HeroIntro";
import { useHeroQuoteAnimation } from "./hero/useHeroQuoteAnimation";
import type { VippsAmountPreset } from "../constants/data";

interface HeroProps {
  title: string;
  description: string;
  ctaText: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  sponsors?: Array<{ src: string; alt: string }>;
  vippsAmountPresets?: VippsAmountPreset[];
  id?: string;
}

export default function Hero({
  title,
  description,
  ctaText,
  backgroundImage = "/hero.jpg",
  backgroundImageMobile,
  sponsors = [],
  vippsAmountPresets = [],
  id = "hero",
}: HeroProps) {
  const quoteRef = useRef<HTMLHeadingElement>(null);
  useHeroQuoteAnimation(quoteRef);

  return (
    <section
      id={id}
      className="relative w-full h-screen flex items-center justify-center"
    >
      <HeroImage
        src={backgroundImage}
        srcMobile={backgroundImageMobile}
        alt="Hero-bakgrunn"
      />

      <div className="z-10 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40 lg:pt-48 pb-10">
        <HeroQuickNav vippsAmountPresets={vippsAmountPresets} />
        <HeroIntro
          ref={quoteRef}
          ctaText={ctaText}
          pageTitle={title}
          pageSubtitle={description}
        />
      </div>

      <HeroMobileVippsBar vippsAmountPresets={vippsAmountPresets} />

      {sponsors.length > 0 && (
        <div className="hidden md:block absolute inset-x-0 bottom-0 z-10">
          <SponsorsStrip sponsors={sponsors} variant="overlay" />
        </div>
      )}
    </section>
  );
}
