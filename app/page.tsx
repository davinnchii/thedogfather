"use client";

import { useState, useCallback, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Services from "./components/Services";
import News from "./components/News";
import Testimonials from "./components/Testimonials";
import TestimonialsCTA from "./components/TestimonialsCTA";
import Footer from "./components/Footer";
import UnderConstruction from "./components/UnderConstruction";
import ContactForm from "./components/ContactForm";
import About from "./components/About";
import SponsorsStrip from "./components/SponsorsStrip";
import { TrackedSection } from "./components/ui";
import { isUnderConstruction } from "./utils/env";

import {
  heroData,
  galleryData,
  servicesData,
  aboutData,
  newsData,
  testimonialsData,
  footerData,
} from "./constants/data";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const underConstruction = isUnderConstruction();

  // Callback to handle section visibility changes
  const handleSectionInView = useCallback(
    (sectionId: string, inView: boolean) => {
      if (inView) {
        setActiveSection(sectionId);
      }
    },
    [],
  );

  // Scroll to section when URL contains a hash (e.g. #services)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;

      const targetId = hash.replace("#", "");
      if (!targetId) return;

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Run on initial mount
    scrollToHash();

    // Also handle hash changes while staying on the same page
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);


  if (underConstruction) {
    return (
      <main className="min-h-screen bg-surface">
        <UnderConstruction />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Navigation activeSection={activeSection} />

      <TrackedSection sectionId="hero" onInViewChange={handleSectionInView}>
        <Hero {...heroData} />
      </TrackedSection>

      {heroData.sponsors && heroData.sponsors.length > 0 && (
        <div className="md:hidden border-b border-neutral-200/80 bg-surface">
          <SponsorsStrip sponsors={heroData.sponsors} variant="surface" />
        </div>
      )}

      <TrackedSection
        sectionId="qualifications"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <About {...aboutData} />
      </TrackedSection>

      <TrackedSection
        sectionId="testimonials"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <Testimonials
          {...testimonialsData}
          googleMapsReviewUrl={footerData.googleMapsUrl}
        />
      </TrackedSection>

      <TrackedSection
        sectionId="news"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <News {...newsData} />
      </TrackedSection>

      <TrackedSection
        sectionId="services"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <Services {...servicesData} />
      </TrackedSection>

      <TrackedSection
        sectionId="testimonials-cta"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.15 }}
      >
        <TestimonialsCTA googleMapsReviewUrl="https://www.google.com/search?hl=uk-NO&gl=no&q=The+DogFather+Skien,+Nedre+Hjellegate+18,+3724+Skien&ludocid=14081014430431577114&lsig=AB86z5Urm1A5dxkBOTGe-qLKaiZR#lrd=0x4647218dce7f9d91:0xc369d0052306041a,3" />
      </TrackedSection>

      <TrackedSection
        sectionId="gallery"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.2 }}
      >
        <Gallery {...galleryData} />
      </TrackedSection>

      <TrackedSection
        sectionId="contact"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <ContactForm />
      </TrackedSection>

      {/* <TrackedSection
        sectionId="booking"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <BookingSection onBookTimeClick={openBookingPopup} />
      </TrackedSection> */}

      <TrackedSection
        sectionId="footer"
        onInViewChange={handleSectionInView}
        scrollAnimation={{ delay: 0.1 }}
      >
        <Footer {...footerData} />
      </TrackedSection>
    </main>
  );
}
