"use client";

interface HeroImageProps {
  src?: string;
  srcMobile?: string;
  alt?: string;
  className?: string;
  overlayClassName?: string;
}

export default function HeroImage({
  src = "/hero.jpg",
  srcMobile = "/hero_mobile.jpg",
  alt = "Hero background",
  className = "",
  overlayClassName = "bg-overlay-dark",
}: HeroImageProps) {
  const mobileUrl = srcMobile ?? src;

  return (
    <div
      className={`hero-bg absolute inset-0 z-0 ${className}`}
      style={
        {
          "--hero-bg-mobile": `url(${mobileUrl})`,
          "--hero-bg-desktop": `url(${src})`,
        } as React.CSSProperties
      }
      role="img"
      aria-label={alt}
    >
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
    </div>
  );
}

