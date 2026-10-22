import { footerData } from "../constants/data";
import { getSiteUrl } from "../lib/site";

export default function JsonLd() {
  const siteUrl = getSiteUrl();
  const phone = footerData.phone.replace(/\s/g, "");

  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PetService"],
    "@id": `${siteUrl}/#business`,
    name: "The Dogfather",
    alternateName: "The DogFather Skien",
    description:
      "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien. Trygghet, struktur og relasjon.",
    url: siteUrl,
    telephone: `+47${phone}`,
    email: footerData.email,
    image: `${siteUrl}/hero.jpg`,
    logo: `${siteUrl}/main_logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nedre Hjellegate 18",
      addressLocality: "Skien",
      postalCode: "3724",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.205367,
      longitude: 9.606522,
    },
    areaServed: {
      "@type": "City",
      name: "Skien",
    },
    sameAs: [footerData.facebook, footerData.instagram, footerData.tiktok].filter(
      Boolean,
    ),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
