import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData, footerData } from "../../constants/data";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = servicesData.services.find((s: Service) => s.id === id);

  if (!service) {
    return { title: "Tjeneste ikke funnet" };
  }

  const description =
    service.description.length > 155
      ? `${service.description.slice(0, 152)}…`
      : service.description;

  return {
    title: service.title,
    description,
    alternates: {
      canonical: `/services/${service.id}`,
    },
    openGraph: {
      title: `${service.title} | The Dogfather`,
      description,
      url: `/services/${service.id}`,
      images: service.image
        ? [{ url: service.image, alt: service.title }]
        : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
