import { notFound } from "next/navigation";
import { servicesData } from "../../constants/data";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { footerData } from "../../constants/data";
import ServiceDetailContent from "../../components/ServiceDetailContent";
import ContactForm from "../../components/ContactForm";

interface ServiceFAQ {
  question: string;
  answer: string;
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
  details: Array<{ title: string; description: string }>;
}

export async function generateStaticParams() {
  return servicesData.services.map((service: Service) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const service = servicesData.services.find((s: Service) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navigation withLogo />
      <ServiceDetailContent service={service} />
      <section id="contact" className="bg-surface">
        <ContactForm
          title="Bestill denne tjenesten"
          subtitle={`Interessert i ${service.title}? Fyll ut skjemaet under, så tar jeg kontakt så snart som mulig.`}
        />
      </section>
      <Footer {...footerData} />
    </main>
  );
}
