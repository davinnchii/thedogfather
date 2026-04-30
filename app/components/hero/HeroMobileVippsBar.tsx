"use client";

import HeroVippsButton from "./HeroVippsButton";
import type { VippsAmountPreset } from "@/app/constants/data";

type HeroMobileVippsBarProps = {
  vippsAmountPresets?: VippsAmountPreset[];
};

export default function HeroMobileVippsBar({
  vippsAmountPresets = [],
}: HeroMobileVippsBarProps) {
  return (
    <div className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-3 z-20 flex flex-col items-center w-full">
      <HeroVippsButton
        size="sm"
        amountPresets={vippsAmountPresets}
        className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-[#FF5B24] shadow-lg hover:bg-[#F14E1F] transition-colors"
      />
      <p className="mt-1 text-sm text-white/90 text-center px-2">
        Kun etter bookingbekreftelse
      </p>
    </div>
  );
}
