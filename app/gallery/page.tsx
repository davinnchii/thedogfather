"use client";

import Navigation from "../components/Navigation";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import TestimonialsCTA from "../components/TestimonialsCTA";
import { Container } from "../components/ui";
import { galleryData, footerData } from "../constants/data";

export default function FullGalleryPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-24 pb-16">
        {/* 1. Welcoming text */}
        <section className="py-12 md:py-16 px-4">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-semibold text-on-surface mb-4">
                Velkommen til galleriet
              </h1>
              <p className="text-on-surface/80 text-base md:text-lg leading-relaxed">
                Her får du et innblikk i hverdagen med hundene som er innom – turer i skog og mark,
                lek, trening og rolige stunder. Bildene viser det vi jobber for hver dag:
                trygghet, struktur og god relasjon mellom hund og menneske.
              </p>
            </div>
          </Container>
        </section>

        {/* 2. Gallery */}
        <Gallery
          title="Galleri"
          items={galleryData.items}
          id="gallery-full"
        />

        {/* 3. Same review CTA as home, with gallery-specific text */}
        <TestimonialsCTA
          googleMapsReviewUrl={footerData.googleMapsUrl}
          title="Del din opplevelse"
          description="Har du bilder eller video fra tiden hunden var hos meg? Del gjerne opplevelsen – og bildene – i en anmeldelse på Google."
        />
      </div>
      <Footer {...footerData} />
    </main>
  );
}
