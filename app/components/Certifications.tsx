"use client";

import { useState } from "react";
import Image from "next/image";

interface Benefit {
  title?: string;
  titles?: string[]; // For grouped certifications from same school
  description: string;
  icon?: string;
  logo?: string;
  type?: "instruktor" | "coach"; // Category for tab filtering
}

interface CertificationsProps {
  title?: string;
  benefits: Benefit[];
  id?: string;
}

export default function Certifications({
  title = "Referanser og sertifiseringer",
  benefits,
  id = "qualifications",
}: CertificationsProps) {
  const [activeTab, setActiveTab] = useState<"instruktor" | "coach">("instruktor");

  // Filter benefits based on active tab
  const filteredBenefits = benefits.filter(
    (benefit) => benefit.type === activeTab || (!benefit.type && activeTab === "instruktor")
  );

  // Find common logo (prefer first benefit with logo, or find shared logo)
  const commonLogo = benefits.find((b) => b.logo)?.logo;

  // Get active benefit for current tab
  const activeBenefit = filteredBenefits[0];

  return (
    <section id={id} className="py-20 px-4 bg-surface-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-on-surface">
          {title}
        </h2>

        {/* Certifications */}
        {benefits.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-center mb-6 text-neutral-800">
              Utdanning & Erfaring
            </h3>
            
            <div className="certifications-container bg-gradient-to-br from-surface via-surface to-neutral-50 px-6 sm:px-10 py-10 rounded-xl shadow-xl border border-neutral-200/50 w-full relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent-blue rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-purple rounded-full blur-3xl"></div>
              </div>
              
              <div className="flex flex-col gap-8 relative z-10">
                {/* Logo - Shared for both tabs */}
                {commonLogo && (
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center h-32 w-48 sm:h-36 sm:w-56 bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-neutral-200/50">
                            <Image
                        src={commonLogo}
                        alt="Oslo Hundeskole"
                              width={220}
                              height={110}
                        loading="lazy"
                        className="object-contain max-h-24 w-auto transition-transform duration-300 hover:scale-110"
                            />
                    </div>
                          </div>
                        )}
                        
                {/* Tabs */}
                <div className="flex justify-center">
                  <div className="inline-flex bg-white rounded-lg p-1 shadow-md border border-neutral-200">
                    <button
                      onClick={() => setActiveTab("instruktor")}
                      className={`px-6 py-3 cursor-pointer rounded-md font-semibold text-base transition-all duration-300 ${
                        activeTab === "instruktor"
                          ? "bg-primary text-on-surface shadow-sm"
                          : "text-on-surface-secondary hover:text-on-surface"
                      }`}
                    >
                      Instruktor
                    </button>
                    <button
                      onClick={() => setActiveTab("coach")}
                      className={`px-6 py-3 cursor-pointer rounded-md font-semibold text-base transition-all duration-300 ${
                        activeTab === "coach"
                          ? "bg-primary text-on-surface shadow-sm"
                          : "text-on-surface-secondary hover:text-on-surface"
                      }`}
                    >
                      Coach
                    </button>
                  </div>
                </div>

                {/* Content for active tab */}
                {activeBenefit ? (
                  <div className="flex flex-col gap-6 w-full group transition-all duration-300">
                    {/* Titles Section - Centered */}
                    <div className="flex flex-col items-center gap-3">
                      {activeBenefit.titles && activeBenefit.titles.length > 0 ? (
                          <div className="flex flex-col items-center gap-3">
                          {activeBenefit.titles.map((title, titleIndex) => (
                            <h4
                                key={titleIndex}
                              className="text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300 text-center"
                              >
                                  {title}
                                </h4>
                            ))}
                          </div>
                      ) : activeBenefit.title ? (
                          <h4 className="text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300 text-center">
                          {activeBenefit.title}
                          </h4>
                      ) : null}
                      </div>
                      
                      {/* Full-width Description Below */}
                    {activeBenefit.description && (
                        <div className="pt-6 border-t-2 border-primary/20">
                          <p className="text-base sm:text-lg text-on-surface-secondary leading-relaxed text-center max-w-4xl mx-auto">
                          {activeBenefit.description}
                          </p>
                        </div>
                      )}
                    </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-on-surface-secondary text-lg">
                      Ingen opplysninger tilgjengelig for denne kategorien.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
