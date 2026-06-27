import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import DiplomaGallery from "../components/DiplomaGallery";
import { Container, SectionTitle } from "../components/ui";
import { educationData, footerData } from "../constants/data";

export const metadata: Metadata = {
  title: "Utdanning og kompetanse | The Dogfather",
  description:
    "Utdanning og kompetanse hos The Dogfather – hundetrener og instruktørutdanning ved Oslo Hundeskole, videreutdanning og kontinuerlig faglig utvikling.",
};

export default function UtdanningPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-24 pb-16">
        <section className="relative py-12 md:py-16 px-4 overflow-hidden bg-surface-secondary">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 45%)`,
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-200/60 to-transparent" />

          <Container size="5xl" className="relative">
            <SectionTitle eyebrow={educationData.eyebrow} divider className="mb-10">
              {educationData.title}
            </SectionTitle>

            <div className="space-y-8 md:space-y-10">
              {educationData.sections.map((section, index) => (
                <article
                  key={section.heading}
                  className="rounded-xl border border-neutral-200/60 bg-surface/80 px-5 py-6 md:px-8 md:py-8 shadow-md"
                >
                  <h2 className="mb-3 flex items-baseline gap-2 text-xl md:text-2xl font-bold text-on-surface">
                    <span className="text-primary/70 font-mono text-xs md:text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="space-y-3">
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {"diplomas" in section && section.diplomas && (
                    <div className="mt-6 pt-6 border-t border-neutral-200/60">
                      <DiplomaGallery images={section.diplomas} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Container>
        </section>
      </div>
      <Footer {...footerData} />
    </main>
  );
}
