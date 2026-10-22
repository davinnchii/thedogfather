import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: {
    absolute: "The Dogfather – Hundelufting, dagpass og trening i Skien",
  },
  description:
    "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien. Trygghet, struktur og relasjon – hos The Dogfather.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Dogfather – Hundelufting, dagpass og trening i Skien",
    description:
      "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien. Trygghet, struktur og relasjon.",
    url: "/",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
