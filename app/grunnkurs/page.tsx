import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CoursePageContent from "../components/CoursePageContent";
import ContactForm from "../components/ContactForm";
import { grunnkursData, footerData } from "../constants/data";

export const metadata: Metadata = {
  title: "Grunnkurs – unghund | The Dogfather",
  description:
    "Grunnkurs for hunder fra 4–5 måneder med valpekurs, eller fra 6 måneder uten – trygghet, struktur og relasjon med positiv og belønningsbasert trening hos The Dogfather.",
};

export default function GrunnkursPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-24 pb-16">
        <CoursePageContent course={grunnkursData} />
        <section id="contact" className="bg-surface px-4 pb-16">
          <ContactForm
            title="Påmelding til grunnkurs"
            subtitle="Fyll ut skjemaet under og velg «Grunnkurs», så tar jeg kontakt så snart som mulig."
            preselectedServices={["grunnkurs"]}
          />
        </section>
      </div>
      <Footer {...footerData} />
    </main>
  );
}
