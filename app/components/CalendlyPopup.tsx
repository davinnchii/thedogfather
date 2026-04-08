"use client";

import { useEffect, useCallback } from "react";
import type { CalendlyEventTypePublic } from "../constants/calendly";

interface CalendlyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** Main scheduling URL (all event types). Used when no eventType is set. */
  schedulingUrl: string | null;
  /** Pre-select an event type; if set, uses its schedulingUrl instead. */
  eventType?: CalendlyEventTypePublic | null;
  /** Shown while schedulingUrl is loading */
  loading?: boolean;
}

export default function CalendlyPopup({
  isOpen,
  onClose,
  schedulingUrl,
  eventType = null,
  loading = false,
}: CalendlyPopupProps) {
  const url = eventType
    ? eventType.schedulingUrl
    : schedulingUrl ?? "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bestill time – Calendly"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Lukk"
      />

      <div className="relative z-10 flex h-full w-full flex-col bg-surface md:h-[90vh] md:max-h-[900px] md:w-full md:max-w-4xl md:rounded-2xl md:shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-divider px-4 py-3 md:px-6">
          <h2 className="text-lg font-semibold text-on-surface">
            {eventType ? eventType.name : "Bestill time"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-secondary transition-colors hover:bg-neutral-100 hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Lukk"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {loading || !url ? (
            <div className="flex h-full min-h-[70vh] items-center justify-center text-on-surface-secondary">
              {loading ? "Laster..." : "Calendly er ikke konfigurert."}
            </div>
          ) : (
            <iframe
              src={url}
              title="Bestilling via Calendly"
              className="h-full w-full min-h-[70vh] md:min-h-0"
              style={{ border: 0 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
