"use client";

import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  priceNote?: string;
  targetAudience?: string;
  benefits?: string[];
  faq?: Array<{ question: string; answer: string }>;
  details: Array<{ title: string; description: string }>;
}

interface ServiceDetailContentProps {
  service: Service;
}

export default function ServiceDetailContent({
  service,
}: ServiceDetailContentProps) {
  return (
    <section className="py-32 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/#services"
          className="inline-flex items-center text-white-90 hover:text-white mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Tilbake til tjenester
        </Link>

        {/* Main Content: Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left Side: Image */}
          <div className="relative h-96 lg:h-[500px] w-full rounded-lg overflow-hidden shadow-lg border-2 border-services-image">
            <Image
              src={service.image}
              alt={service.title}
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>

          {/* Right Side: Title, Description, Benefits */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {service.title}
              </h1>
              {service.price && (
                <div className="flex lg:flex-col items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {service.price}
                  </span>
                  {service.priceNote && (
                    <span className="text-white-70 text-sm">
                      {service.priceNote}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Beskrivelse
              </h2>
              <p className="text-white-90 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Who It Suits Best */}
            {service.targetAudience && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Hvem passer det best for
                </h2>
                <p className="text-white-90 leading-relaxed">
                  {service.targetAudience}
                </p>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Fordeler</h2>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-white-90"
                    >
                      <span className="text-primary mt-1 flex-shrink-0">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="block w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-6 rounded-lg transition-colors text-center"
              >
                Bestill denne tjenesten
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
