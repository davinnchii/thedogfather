import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CoursePageContent from "../components/CoursePageContent";
import ContactForm from "../components/ContactForm";
import { grunnkursData, footerData } from "../constants/data";

export const metadata: Metadata = {
  title: "Grunnkurs | The Dogfather",
  description: "Grunnkurs hos The Dogfather – hundetrening med fokus på samarbeid og gode vaner.",
};

export default function GrunnkursPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-24 pb-16">
        <CoursePageContent course={grunnkursData} />
        <section id="contact" className="bg-surface px-4 pb-16">
          <ContactForm
            title="Meld interesse for grunnkurs"
            subtitle="Fyll ut skjemaet under og velg «Grunnkurs», så tar jeg kontakt så snart som mulig."
            preselectedServices={["grunnkurs"]}
          />
        </section>
      </div>
      <Footer {...footerData} />
    </main>
  );
}
