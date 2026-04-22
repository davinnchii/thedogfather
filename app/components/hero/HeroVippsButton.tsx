"use client";

import { useState } from "react";
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
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleClick() {
    if (status === "loading") return;
    setErrorMessage(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/vipps/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) {
        setErrorMessage(
          data.error || "Kunne ikke starte Vipps. Sjekk at tjenesten er konfigurert.",
        );
        setStatus("idle");
        return;
      }
      window.location.assign(data.redirectUrl);
    } catch {
      setErrorMessage("Nettverksfeil. Prøv igjen.");
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-w-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className={className + " cursor-pointer disabled:opacity-60 disabled:cursor-wait"}
        aria-label="Betal med Vipps"
        aria-busy={status === "loading"}
      >
        <Image
          src={VIPPS_SRC}
          alt=""
          width={isSm ? 80 : 88}
          height={isSm ? 26 : 28}
          className={`${isSm ? "h-6" : "h-7"} w-auto object-contain brightness-0 invert`}
        />
      </button>
      {errorMessage ? (
        <p
          className="mt-1 max-w-[16rem] text-center text-xs text-red-200 md:text-primary-200"
          role="status"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
