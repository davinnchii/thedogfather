"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { VippsAmountPreset } from "@/app/constants/data";
import { VIPPS_NOK_MAX_ORE, VIPPS_NOK_MIN_ORE } from "@/app/lib/vipps/amounts";

const VIPPS_SRC = "/vipps-transparent.png";
const VIPPS_FALLBACK_NUMBER = "41145";

type HeroVippsButtonProps = {
  size?: "sm" | "md";
  className?: string;
  amountPresets?: VippsAmountPreset[];
};

export default function HeroVippsButton({
  size = "md",
  className = "",
  amountPresets = [],
}: HeroVippsButtonProps) {
  const isSm = size === "sm";
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAmountOre, setSelectedAmountOre] = useState<number | null>(
    amountPresets[0]?.amountOre ?? null,
  );
  const [customKrInput, setCustomKrInput] = useState("");
  const [copiedFallback, setCopiedFallback] = useState(false);

  const minKr = VIPPS_NOK_MIN_ORE / 100;
  const maxKr = VIPPS_NOK_MAX_ORE / 100;

  const finalAmountOre = useMemo(() => {
    if (selectedAmountOre != null) return selectedAmountOre;
    const normalized = customKrInput.replace(",", ".").trim();
    if (!normalized) return null;
    const asKr = Number(normalized);
    if (!Number.isFinite(asKr)) return null;
    return Math.round(asKr * 100);
  }, [selectedAmountOre, customKrInput]);

  const amountValidationError = useMemo(() => {
    if (finalAmountOre == null) return "Velg eller skriv inn et beløp.";
    if (finalAmountOre < VIPPS_NOK_MIN_ORE) {
      return `Minimum er ${minKr.toFixed(2).replace(".", ",")} kr.`;
    }
    if (finalAmountOre > VIPPS_NOK_MAX_ORE) {
      return `Maksimum er ${maxKr.toLocaleString("no-NO")} kr.`;
    }
    return null;
  }, [finalAmountOre, minKr, maxKr]);

  function openModal() {
    setErrorMessage(null);
    setCopiedFallback(false);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (status === "loading") return;
    setIsModalOpen(false);
  }

  async function copyFallbackNumber() {
    try {
      await navigator.clipboard.writeText(VIPPS_FALLBACK_NUMBER);
      setCopiedFallback(true);
      window.setTimeout(() => setCopiedFallback(false), 1800);
    } catch {
      setCopiedFallback(false);
    }
  }

  async function startVippsPayment() {
    if (status === "loading") return;
    if (amountValidationError || finalAmountOre == null) {
      setErrorMessage(amountValidationError || "Ugyldig beløp.");
      return;
    }

    setErrorMessage(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/vipps/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountOre: finalAmountOre }),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) {
        setErrorMessage(
          data.error ||
            "Kunne ikke starte Vipps nå. Bruk gjerne Vipps-nummer #41145 i appen.",
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
        onClick={openModal}
        disabled={status === "loading"}
        className={className + " cursor-pointer disabled:opacity-60 disabled:cursor-wait"}
        aria-label="Betal med Vipps"
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

      {isModalOpen && typeof window !== "undefined"
        ? createPortal(
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Velg Vipps-beløp"
        >
          <div className="w-full max-w-md rounded-2xl border border-primary-300 bg-surface p-5 text-left shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Velg beløp</h3>
                <p className="text-sm text-muted">
                  Velg et forhåndsbeløp eller skriv inn selv.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-neutral-300 px-2 py-1 text-sm text-muted hover:bg-surface-secondary"
                aria-label="Lukk"
              >
                X
              </button>
            </div>

            {amountPresets.length > 0 ? (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {amountPresets.map((preset) => {
                  const active = selectedAmountOre === preset.amountOre;
                  return (
                    <button
                      key={`${preset.label}-${preset.amountOre}`}
                      type="button"
                      onClick={() => {
                        setSelectedAmountOre(preset.amountOre);
                        setCustomKrInput("");
                        setErrorMessage(null);
                      }}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-neutral-300 text-foreground hover:border-primary-300 hover:bg-primary-15/30"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <label className="block text-sm font-semibold text-foreground mb-1" htmlFor="vipps-custom-amount">
              Eget beløp (kr)
            </label>
            <input
              id="vipps-custom-amount"
              type="text"
              inputMode="decimal"
              value={customKrInput}
              onChange={(e) => {
                setCustomKrInput(e.target.value);
                setSelectedAmountOre(null);
                setErrorMessage(null);
              }}
              placeholder="f.eks. 350"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-foreground outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
            <p className="mt-1 text-xs text-muted">
              Tillatt: {minKr.toFixed(2).replace(".", ",")} - {maxKr.toLocaleString("no-NO")} kr
            </p>

            {amountValidationError ? (
              <p className="mt-3 text-sm text-red-600" role="status">
                {amountValidationError}
              </p>
            ) : null}
            {errorMessage ? (
              <p className="mt-2 text-sm text-red-600" role="status">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={startVippsPayment}
                disabled={status === "loading" || !!amountValidationError}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {status === "loading" ? "Sender til Vipps..." : "Fortsett til Vipps"}
              </button>

              <button
                type="button"
                onClick={copyFallbackNumber}
                className="inline-flex items-center justify-center rounded-full border border-primary-300 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-primary-15/40"
              >
                {copiedFallback
                  ? "Kopiert: #41145"
                  : "Hvis feil: Kopier Vipps-nummer #41145"}
              </button>

            </div>
          </div>
        </div>,
          document.body,
        )
        : null}
    </div>
  );
}
