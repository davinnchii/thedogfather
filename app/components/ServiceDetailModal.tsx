"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ServiceFAQ {
  question: string;
  answer: string;
}

interface ServiceDetail {
  title: string;
  description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  priceNote?: string;
  targetAudience?: string;
  benefits?: string[];
  faq?: ServiceFAQ[];
  details: ServiceDetail[];
}

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceDetailModal({
  service,
  isOpen,
  onClose,
}: ServiceDetailModalProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === String(index) ? null : String(index));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-dark rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-muted/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-64 w-full">
          <Image
            src={service.image}
            alt={service.title}
            fill
            loading="lazy"
            className="object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-surface-dark/90 hover:bg-muted rounded-full flex items-center justify-center transition-colors border border-muted/30"
            aria-label="Lukk"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-4xl font-bold text-white mb-2">
              {service.title}
            </h2>
            {service.price && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {service.price}
                </span>
                {service.priceNote && (
                  <span className="text-white/70 text-sm">
                    {service.priceNote}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Beskrivelse</h3>
            <p className="text-white/90 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Who It Suits Best */}
          {service.targetAudience && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Hvem passer det best for
              </h3>
              <p className="text-white/90 leading-relaxed">
                {service.targetAudience}
              </p>
            </div>
          )}

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Fordeler</h3>
              <ul className="space-y-2">
                {service.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-white/90"
                  >
                    <span className="text-primary mt-1">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Details */}
          {service.details && service.details.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Hva er inkludert
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.details.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 border border-muted/30 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-primary mb-2">
                      {detail.title}
                    </h4>
                    <p className="text-white/80 text-sm">
                      {detail.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {service.faq && service.faq.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Ofte stilte spørsmål
              </h3>
              <div className="space-y-3">
                {service.faq.map((faq, index) => {
                  const isExpanded = expandedFaq === String(index);
                  return (
                    <div
                      key={index}
                      className="bg-muted/30 border border-muted/30 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
                      >
                        <span className="font-semibold text-white pr-4">
                          {faq.question}
                        </span>
                        <span
                          className={`flex-shrink-0 transform transition-transform duration-300 text-primary ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-4 pb-4">
                          <p className="text-white/90 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-4 border-t border-muted/30">
            <a
              href="#contact"
              className="block w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-6 rounded-lg transition-colors text-center"
            >
              Bestill denne tjenesten
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
