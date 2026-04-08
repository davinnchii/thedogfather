"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  linkClassName?: string;
}

export default function Logo({
  href = "/#hero",
  width = 120,
  height = 72,
  alt = "The Dogfather-logo",
  className = "object-contain",
  linkClassName = "flex items-center transition-opacity hover:opacity-80",
}: LogoProps) {
  const logoImage = (
    <Image
      src="/logo.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );

  if (href) {
    return (
      <Link href={href} className={linkClassName}>
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}

