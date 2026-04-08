"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CalendlyConfigPublic, CalendlyEventTypePublic } from "../constants/calendly";
import Navigation from "../components/Navigation";

function formatDuration(minutes: number): string {
  if (minutes <= 0) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} t ${m} min` : `${h} t`;
}

export default function BookingPage() {
  const [config, setConfig] = useState<CalendlyConfigPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<CalendlyEventTypePublic | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/calendly/event-types")
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 503 ? "Calendly er ikke satt opp" : "Kunne ikke laste kalender");
        return res.json();
      })
      .then((data: CalendlyConfigPublic) => {
        if (!cancelled) {
          setConfig(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Noe gikk galt");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const eventTypes = config?.eventTypes ?? [];
  const schedulingUrl = selectedType ? selectedType.schedulingUrl : config?.schedulingUrl ?? null;

  return (
    <main className="min-h-screen bg-surface-secondary">
      <Navigation activeSection="" />

      <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-on-surface md:text-5xl">
            Bestill time
          </h1>
          <p className="mt-3 text-lg text-on-surface-secondary">
            Velg type avtale og book direkte i kalenderen.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-on-surface-secondary">
            Laster...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
            <p className="font-medium">{error}</p>
            <p className="mt-2 text-sm">
              Legg til CALENDLY_API_TOKEN i .env.local for å aktivere booking.
            </p>
            <Link href="/" className="mt-4 inline-block text-primary font-medium hover:underline">
              Tilbake til forsiden
            </Link>
          </div>
        ) : (
          <>
            {eventTypes.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 text-xl font-semibold text-on-surface">
                  Velg type avtale
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                      selectedType === null
                        ? "border-primary bg-primary/10"
                        : "border-divider bg-surface hover:border-primary/50 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="font-semibold text-on-surface">
                      Alle typer
                    </span>
                    <span className="mt-1 text-sm text-on-surface-secondary">
                      Vis alle tilgjengelige avtaler
                    </span>
                  </button>
                  {eventTypes.map((eventType) => (
                    <button
                      key={eventType.uri}
                      type="button"
                      onClick={() => setSelectedType(eventType)}
                      className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                        selectedType?.uri === eventType.uri
                          ? "border-primary bg-primary/10"
                          : "border-divider bg-surface hover:border-primary/50 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="font-semibold text-on-surface">
                        {eventType.name}
                      </span>
                      {eventType.duration > 0 && (
                        <span className="mt-1 text-sm text-on-surface-secondary">
                          {formatDuration(eventType.duration)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-divider bg-surface shadow-lg">
              {schedulingUrl ? (
                <div className="relative h-[70vh] min-h-[500px] w-full md:min-h-[600px]">
                  <iframe
                    src={schedulingUrl}
                    title={selectedType?.name ?? "Calendly"}
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-on-surface-secondary">
                    {eventTypes.length === 0
                      ? "Ingen avtaletyper funnet i Calendly."
                      : "Velg en type avtale over for å åpne kalenderen."}
                  </p>
                  <Link
                    href="/"
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Tilbake til forsiden
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-on-surface-secondary hover:text-on-surface"
          >
            ← Tilbake til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
