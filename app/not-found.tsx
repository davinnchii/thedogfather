"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 leading-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-dark mb-4">
            Oi! Denne siden ble borte
          </h2>
          <p className="text-lg md:text-xl text-on-surface-secondary">
            Ser ut som denne siden har gått seg bort. La oss få deg tilbake på sporet!
          </p>
        </div>

        {/* Tilbake til forsiden Button */}
        <Link
          href="/"
          className="inline-block relative px-8 py-4 bg-primary text-on-primary rounded-full text-lg font-semibold overflow-hidden group transition-all hover:shadow-lg hover:scale-105"
        >
          <span className="relative z-10 block">Tilbake til forsiden</span>
          <span className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 origin-bottom-left transition-transform duration-300 ease-out"></span>
          <span className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 origin-top-right transition-transform duration-300 ease-out"></span>
          <span className="absolute inset-0 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 font-semibold">
            Tilbake til forsiden
          </span>
        </Link>
      </div>
    </main>
  );
}

