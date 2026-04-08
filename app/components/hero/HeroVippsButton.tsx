"use client";

import Image from "next/image";

const VIPPS_SRC = "/vipps-transparent.png";

type HeroVippsButtonProps = {
  size?: "sm" | "md";
  className?: string;
};

export default function HeroVippsButton({
  size = "md",
  className = "",
}: HeroVippsButtonProps) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      className={className + " cursor-pointer"}
      aria-label="Betal med Vipps (lenke settes senere)"
    >
      <Image
        src={VIPPS_SRC}
        alt=""
        width={isSm ? 80 : 88}
        height={isSm ? 26 : 28}
        className={`${isSm ? "h-6" : "h-7"} w-auto object-contain brightness-0 invert`}
      />
    </button>
  );
}
