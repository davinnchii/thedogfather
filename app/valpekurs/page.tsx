import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CoursePageContent from "../components/CoursePageContent";
import ContactForm from "../components/ContactForm";
import { valpekursData, footerData } from "../constants/data";

export const metadata: Metadata = {
  title: "Valpekurs | The Dogfather",
  description:
    "Valpekurs for valper fra 10 uker til 6 måneder hos The Dogfather – trygghet, struktur og relasjon med positiv og belønningsbasert trening.",
};

export default function ValpekursPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-24 pb-16">
        <CoursePageContent course={valpekursData} />
        <section id="contact" className="bg-surface px-4 pb-16">
          <ContactForm
            title="Påmelding til valpekurs"
            subtitle="Fyll ut skjemaet under og velg «Valpekurs», så tar jeg kontakt så snart som mulig."
            preselectedServices={["valpekurs"]}
          />
        </section>
      </div>
      <Footer {...footerData} />
    </main>
  );
}
